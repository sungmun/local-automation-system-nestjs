import { Test, TestingModule } from '@nestjs/testing';
import { RecipeService } from './recipe.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { DeviceCommand } from './entities/device-command.entity';
import { DataBaseDeviceService } from '../device/database-device.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Device } from '../device/entities/device.entity';

describe('RecipeService', () => {
  let service: RecipeService;
  let recipeRepository: jest.Mocked<any>;
  let deviceCommandRepository: jest.Mocked<any>;
  let databaseDeviceService: jest.Mocked<DataBaseDeviceService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeService,
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
        {
          provide: getRepositoryToken(DeviceCommand),
          useValue: {
            create: jest.fn((input) => input),
          },
        },
        {
          provide: DataBaseDeviceService,
          useValue: {
            findInIds: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RecipeService>(RecipeService);
    recipeRepository = module.get(getRepositoryToken(Recipe));
    deviceCommandRepository = module.get(getRepositoryToken(DeviceCommand));
    databaseDeviceService = module.get(DataBaseDeviceService);
  });

  it('서비스가 정의되어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('saveRecipe', () => {
    it('레시피를 저장해야 한다', async () => {
      const createRecipeDto: CreateRecipeDto = {
        name: 'Test Recipe',
        description: 'Test Description',
        type: 'Test Type',
        active: true,
        timer: 60,
        deviceCommands: [
          { command: {}, deviceId: 'device1', name: 'Command1' },
        ],
      };
      databaseDeviceService.findInIds.mockResolvedValue([
        {
          id: 'device1',
          platform: 'Test Platform',
        } as Device,
      ]);

      recipeRepository.save.mockResolvedValue(createRecipeDto);

      const result = await service.saveRecipe(createRecipeDto);
      expect(databaseDeviceService.findInIds).toHaveBeenCalled();
      expect(deviceCommandRepository.create).toHaveBeenCalled();
      expect(recipeRepository.save).toHaveBeenCalledWith({
        ...createRecipeDto,
        deviceCommands: [
          {
            ...createRecipeDto.deviceCommands[0],
            platform: 'Test Platform',
            order: 0,
          },
        ],
      });
      expect(result).toEqual(createRecipeDto);
    });
  });

  describe('findAll', () => {
    it('모든 레시피를 반환해야 한다', async () => {
      const recipes = [{ id: 1, name: 'Recipe1' }];
      recipeRepository.find.mockResolvedValue(recipes);

      const result = await service.findAll();

      expect(recipeRepository.find).toHaveBeenCalled();
      expect(result).toEqual(recipes);
    });
  });

  describe('findOne', () => {
    it('ID로 레시피를 찾아야 한다', async () => {
      const recipe = { id: 1, name: 'Recipe1' };
      recipeRepository.findOne.mockResolvedValue(recipe);

      const result = await service.findOne(1);

      expect(recipeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['deviceCommands'],
      });
      expect(result).toEqual(recipe);
    });
  });

  describe('update', () => {
    it('레시피를 업데이트해야 한다. (deviceCommands 없음)', async () => {
      const updateRecipeDto: UpdateRecipeDto = {
        name: 'Updated Recipe',
      };
      const recipe = { id: 1, name: 'Recipe1' };
      recipeRepository.findOne.mockResolvedValue(recipe);

      await service.update(1, updateRecipeDto);

      expect(recipeRepository.update).toHaveBeenCalledWith(1, updateRecipeDto);
    });
    it('레시피를 업데이트해야 한다. (deviceCommands 있음)', async () => {
      const updateRecipeDto: UpdateRecipeDto = {
        name: 'Updated Recipe',
        deviceCommands: [
          { command: {}, deviceId: 'device1', name: 'Command1' },
        ],
      };
      const recipe = { id: 1, name: 'Recipe1' };
      recipeRepository.findOne.mockResolvedValue(recipe);
      databaseDeviceService.findInIds.mockResolvedValue([
        {
          id: 'device1',
          platform: 'Test Platform',
        } as Device,
      ]);

      await service.update(1, updateRecipeDto);

      expect(recipeRepository.save).toHaveBeenCalledWith({
        ...recipe,
        ...updateRecipeDto,
        deviceCommands: [
          {
            ...updateRecipeDto.deviceCommands[0],
            platform: 'Test Platform',
            order: 0,
          },
        ],
      });
    });
  });

  describe('remove', () => {
    it('레시피를 삭제해야 한다', async () => {
      await service.remove(1);

      expect(recipeRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
