import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RecipeCrudService } from './recipe-crud.service';
import { Recipe } from './entities/recipe.entity';
import { CreateRecipeRequestDto, UpdateRecipeRequestDto } from './dto/request';
import { NotFoundException } from '@nestjs/common';
import { RecipeCommandService } from '../recipe-command/recipe-command.service';
import {
  RecipeCommand,
  RecipeCommandPlatform,
} from '../recipe-command/entities/recipe-command.entity';

describe('RecipeCrudService', () => {
  let service: RecipeCrudService;
  let recipeRepository: jest.Mocked<any>;
  let recipeCommandService: jest.Mocked<RecipeCommandService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeCrudService,
        {
          provide: RecipeCommandService,
          useValue: {
            createRecipeCommands: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Recipe),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RecipeCrudService>(RecipeCrudService);
    recipeRepository = module.get(getRepositoryToken(Recipe));
    recipeCommandService = module.get(RecipeCommandService);
  });

  it('서비스가 정의되어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('saveRecipe', () => {
    it('레시피를 저장해야 합니다', async () => {
      const recipeCommand = {
        command: { test: 'test' },
        deviceId: 'device123',
        name: '장치 명령',
        platform: RecipeCommandPlatform.HEJ_HOME,
      };

      const createRecipeDto: CreateRecipeRequestDto = {
        name: '테스트 레시피',
        description: '테스트 설명',
        type: '테스트 타입',
        active: true,
        timer: 60,
        recipeCommands: [recipeCommand],
        recipeGroups: [],
      };

      const expectedRecipeCommand = {
        ...recipeCommand,
        platform: 'device-hejhome',
        order: 0,
      } as unknown as RecipeCommand;

      recipeCommandService.createRecipeCommands.mockResolvedValue([
        expectedRecipeCommand,
      ]);
      recipeRepository.save.mockResolvedValue({ id: 1, ...createRecipeDto });

      const result = await service.saveRecipe(createRecipeDto);

      expect(recipeCommandService.createRecipeCommands).toHaveBeenCalledWith(
        createRecipeDto.recipeCommands,
      );
      expect(recipeRepository.save).toHaveBeenCalledWith({
        ...createRecipeDto,
        recipeCommands: [expectedRecipeCommand],
      });
      expect(result).toHaveProperty('id', 1);
    });
  });

  describe('findAll', () => {
    it('모든 레시피를 조회해야 합니다', async () => {
      const recipes = [
        { id: 1, name: '레시피1' },
        { id: 2, name: '레시피2' },
      ];
      recipeRepository.find.mockResolvedValue(recipes);

      const result = await service.findAll();

      expect(recipeRepository.find).toHaveBeenCalled();
      expect(result).toEqual(recipes);
    });
  });

  describe('findOne', () => {
    it('ID로 레시피를 조회해야 합니다', async () => {
      const recipe = { id: 1, name: '레시피1' };
      recipeRepository.findOne.mockResolvedValue(recipe);

      const result = await service.findOne(1);

      expect(recipeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: [
          'deviceCommands',
          'recipeGroups',
          'recipeGroups.conditions',
        ],
      });
      expect(result).toEqual(recipe);
    });

    it('레시피가 없으면 NotFoundException을 발생시켜야 합니다', async () => {
      recipeRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateRecipeDto: UpdateRecipeRequestDto = {
      name: '업데이트된 레시피',
      description: '업데이트된 설명',
    };

    it('연관테이블 업데이트가 없는 경우 레시피만 업데이트해야 합니다', async () => {
      recipeRepository.update.mockResolvedValue({ affected: 1 });

      await service.update(1, updateRecipeDto);

      expect(recipeRepository.update).toHaveBeenCalledWith(1, updateRecipeDto);
    });

    it('존재하지 않는 레시피는 NotFoundException을 발생시켜야 합니다', async () => {
      recipeRepository.update.mockResolvedValue({ affected: 0 });

      await expect(service.update(1, updateRecipeDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('연관테이블 업데이트가 있는 경우 레시피와 연관테이블을 업데이트해야 합니다', async () => {
      const recipeCommand = {
        command: { test: 'test' },
        deviceId: 'device123',
        name: '장치 명령',
        platform: RecipeCommandPlatform.HEJ_HOME,
      };

      const updateRecipeWithRelationsDto: UpdateRecipeRequestDto = {
        ...updateRecipeDto,
        recipeCommands: [recipeCommand],
        recipeGroups: [],
      };

      const existingRecipe = {
        id: 1,
        name: '기존 레시피',
        recipeCommands: [],
        recipeGroups: [],
      };

      const expectedRecipeCommand = {
        ...recipeCommand,
        platform: 'device-hejhome',
        order: 0,
      } as unknown as RecipeCommand;

      recipeRepository.findOne.mockResolvedValue(existingRecipe);
      recipeCommandService.createRecipeCommands.mockResolvedValue([
        expectedRecipeCommand,
      ]);
      recipeRepository.save.mockResolvedValue({
        ...existingRecipe,
        ...updateRecipeWithRelationsDto,
        recipeCommands: [expectedRecipeCommand],
      });

      await service.update(1, updateRecipeWithRelationsDto);

      expect(recipeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: {
          recipeCommands: true,
          recipeGroups: { conditions: true },
        },
      });
      expect(recipeCommandService.createRecipeCommands).toHaveBeenCalledWith(
        updateRecipeWithRelationsDto.recipeCommands,
      );
      expect(recipeRepository.save).toHaveBeenCalledWith({
        ...existingRecipe,
        ...updateRecipeWithRelationsDto,
        recipeCommands: [expectedRecipeCommand],
      });
    });
  });
});
