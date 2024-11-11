import { Test, TestingModule } from '@nestjs/testing';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { DeviceCommand } from './entities/device-command.entity';
import { DataBaseDeviceService } from '../device/database-device.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

describe('RecipeController', () => {
  let controller: RecipeController;
  let service: RecipeService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipeController],
      providers: [
        {
          provide: RecipeService,
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
    service = module.get<RecipeService>(RecipeService);
  });

  it('서비스가 정의되어야 한다', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('레시피를 저장해야 한다', async () => {
      const createRecipeDto = {} as CreateRecipeDto;
      await controller.create(createRecipeDto);
      expect(service.saveRecipe).toHaveBeenCalledWith(createRecipeDto);
    });
  });

  describe('findAll', () => {
    it('레시피를 조회해야 한다', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('레시피를 조회해야 한다', async () => {
      const id = 1;
      await controller.findOne(id.toString());
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('레시피를 업데이트해야 한다', async () => {
      const id = 1;
      const updateRecipeDto = {} as UpdateRecipeDto;
      await controller.update(id.toString(), updateRecipeDto);
      expect(service.update).toHaveBeenCalledWith(id, updateRecipeDto);
    });
  });

  describe('remove', () => {
    it('레시피를 삭제해야 한다', async () => {
      const id = 1;
      await controller.remove(id.toString());
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
