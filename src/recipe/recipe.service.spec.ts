import { Test, TestingModule } from '@nestjs/testing';
import { RecipeService } from './recipe.service';
import { RecipeConditionService } from '../recipe-condition/recipe-condition.service';
import { RecipeCrudService } from './recipe-crud.service';
import { RecipeCommandService } from '../recipe-command/recipe-command.service';
import { NotFoundException } from '@nestjs/common';
import { Recipe, RecipeStatus } from './entities/recipe.entity';
import { Repository, UpdateResult } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('RecipeService', () => {
  let service: RecipeService;
  let recipeRepository: jest.Mocked<Repository<Recipe>>;
  let recipeCrudService: jest.Mocked<RecipeCrudService>;
  let recipeConditionService: jest.Mocked<RecipeConditionService>;
  let recipeCommandService: jest.Mocked<RecipeCommandService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeService,
        {
          provide: getRepositoryToken(Recipe),
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: RecipeCrudService,
          useValue: {
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
          },
        },
        {
          provide: RecipeConditionService,
          useValue: {
            checkRecipeConditions: jest.fn(),
          },
        },
        {
          provide: RecipeCommandService,
          useValue: {
            runCommands: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RecipeService>(RecipeService);
    recipeRepository = module.get(getRepositoryToken(Recipe));
    recipeCrudService = module.get(RecipeCrudService);
    recipeConditionService = module.get(RecipeConditionService);
    recipeCommandService = module.get(RecipeCommandService);
  });

  it('서비스가 정의되어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('runRecipe', () => {
    it('레시피를 실행하고 상태를 업데이트해야 합니다', async () => {
      const recipe = {
        id: 1,
        name: '테스트 레시피',
        recipeCommands: [{ id: 1, order: 0 }],
        active: true,
        status: RecipeStatus.STOPPED,
      } as Recipe;

      recipeCrudService.findOneAndUpdate.mockResolvedValue(recipe);
      recipeCommandService.runCommands.mockResolvedValue(undefined);
      recipeRepository.update.mockResolvedValue({
        affected: 1,
      } as UpdateResult);

      await service.runRecipe(1);

      expect(recipeCrudService.findOneAndUpdate).toHaveBeenCalledWith(
        { id: 1, status: expect.not.stringMatching('RUNNING'), active: true },
        { recipeCommands: true },
        { status: RecipeStatus.RUNNING },
      );
      expect(recipeCommandService.runCommands).toHaveBeenCalledWith(
        recipe.recipeCommands,
      );
      expect(recipeRepository.update).toHaveBeenCalledWith(1, {
        status: RecipeStatus.STOPPED,
      });
    });

    it('실행 중인 레시피는 다시 실행할 수 없어야 합니다', async () => {
      recipeCrudService.findOneAndUpdate.mockRejectedValue(
        new Error('이미 실행 중인 레시피'),
      );

      await expect(service.runRecipe(1)).rejects.toThrow(
        '이미 실행 중인 레시피',
      );
      expect(recipeCommandService.runCommands).not.toHaveBeenCalled();
    });

    it('명령 실행 중 에러가 발생하면 상태를 STOPPED로 변경해야 합니다', async () => {
      const recipe = {
        id: 1,
        recipeCommands: [{ id: 1 }],
        active: true,
        status: RecipeStatus.STOPPED,
      } as Recipe;

      recipeCrudService.findOneAndUpdate.mockResolvedValue(recipe);
      recipeCommandService.runCommands.mockRejectedValue(
        new Error('명령 실행 실패'),
      );

      await expect(service.runRecipe(1)).rejects.toThrow('명령 실행 실패');
      expect(recipeRepository.update).toHaveBeenCalledWith(1, {
        status: RecipeStatus.STOPPED,
      });
    });
  });

  describe('recipeCheck', () => {
    it('레시피 조건을 확인해야 합니다', async () => {
      const recipe = {
        id: 1,
        name: '테스트 레시피',
        recipeGroups: [{ conditions: [] }],
        active: true,
        status: RecipeStatus.STOPPED,
      } as Recipe;

      recipeRepository.findOne.mockResolvedValue(recipe);
      recipeConditionService.checkRecipeConditions.mockResolvedValue(true);

      const result = await service.recipeCheck(1);

      expect(result).toBe(true);
      expect(recipeRepository.findOne).toHaveBeenCalledWith({
        where: { active: true, id: 1 },
        relations: { recipeGroups: { conditions: true } },
        order: { recipeGroups: { conditions: { order: 'ASC' } } },
      });
      expect(recipeConditionService.checkRecipeConditions).toHaveBeenCalledWith(
        recipe.recipeGroups,
      );
    });

    it('실행 중인 레시피는 false를 반환해야 합니다', async () => {
      const recipe = {
        id: 1,
        active: true,
        status: RecipeStatus.RUNNING,
      } as Recipe;

      recipeRepository.findOne.mockResolvedValue(recipe);

      const result = await service.recipeCheck(1);

      expect(result).toBe(false);
      expect(
        recipeConditionService.checkRecipeConditions,
      ).not.toHaveBeenCalled();
    });

    it('비활성화된 레시피는 조회되지 않아야 합니다', async () => {
      recipeRepository.findOne.mockResolvedValue(null);

      await expect(service.recipeCheck(1)).rejects.toThrow(NotFoundException);
      expect(
        recipeConditionService.checkRecipeConditions,
      ).not.toHaveBeenCalled();
    });
  });
});
