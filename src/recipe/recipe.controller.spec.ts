import { Test, TestingModule } from '@nestjs/testing';
import { RecipeController } from './recipe.controller';
import { RecipeCrudService } from './recipe-crud.service';
import { CreateRecipeRequestDto } from './dto/request/create-recipe-request.dto';
import { UpdateRecipeRequestDto } from './dto/request/update-recipe-request.dto';
import { CreateRecipeConditionGroupRequestDto } from '../recipe-condition/dto/request/create-condition-group-request.dto';

describe('RecipeController', () => {
  let controller: RecipeController;
  let recipeCrudService: jest.Mocked<RecipeCrudService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipeController],
      providers: [
        {
          provide: RecipeCrudService,
          useValue: {
            saveRecipe: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RecipeController>(RecipeController);
    recipeCrudService = module.get(RecipeCrudService);
  });

  it('컨트롤러가 정의되어야 한다', () => {
    expect(controller).toBeDefined();
  });

  describe('CRUD 작업', () => {
    describe('create', () => {
      it('완전한 레시피를 생성해야 합니다', async () => {
        const deviceCommand = {
          command: { test: 'test' },
          deviceId: 'device123',
          name: '장치 명령',
          platform: 'platform',
          order: 0,
        };

        const recipeGroup: CreateRecipeConditionGroupRequestDto = {
          conditions: [],
          operator: 'AND',
        };

        const createRecipeDto: CreateRecipeRequestDto = {
          name: '테스트 레시피',
          description: '테스트 설명',
          type: '테스트 타입',
          active: true,
          timer: 60,
          deviceCommands: [deviceCommand],
          recipeGroups: [recipeGroup],
        };

        await controller.create(createRecipeDto);

        expect(recipeCrudService.saveRecipe).toHaveBeenCalledWith(
          createRecipeDto,
        );
      });
    });

    describe('findAll', () => {
      it('모든 레시피를 조회해야 합니다', async () => {
        recipeCrudService.findAll.mockResolvedValue([]);
        await controller.findAll();

        expect(recipeCrudService.findAll).toHaveBeenCalled();
      });
    });

    describe('findOne', () => {
      it('ID로 레시피를 조회해야 합니다', async () => {
        await controller.findOne('1');

        expect(recipeCrudService.findOne).toHaveBeenCalledWith(1);
      });
    });

    describe('update', () => {
      it('레시피를 업데이트해야 합니다', async () => {
        const updateRecipeDto: UpdateRecipeRequestDto = {
          name: '업데이트된 레시피',
          description: '업데이트된 설명',
          deviceCommands: [
            {
              command: { power: 'off' },
              deviceId: 'device1',
              name: '업데이트된 명령',
            },
          ],
        };

        await controller.update('1', updateRecipeDto);

        expect(recipeCrudService.update).toHaveBeenCalledWith(
          1,
          updateRecipeDto,
        );
      });
    });

    describe('remove', () => {
      it('레시피를 삭제해야 합니다', async () => {
        await controller.remove('1');

        expect(recipeCrudService.remove).toHaveBeenCalledWith(1);
      });
    });
  });
});
