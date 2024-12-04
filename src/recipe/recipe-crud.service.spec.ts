import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RecipeCrudService } from './recipe-crud.service';
import { Recipe } from './entities/recipe.entity';
import { CreateRecipeRequestDto, UpdateRecipeRequestDto } from './dto/request';
import { NotFoundException } from '@nestjs/common';
import { DataBaseDeviceService } from '../device/database-device.service';
import { DeviceCommand } from './entities/device-command.entity';
import { Device } from '../device/entities/device.entity';

describe('RecipeCrudService', () => {
  let service: RecipeCrudService;
  let recipeRepository: jest.Mocked<any>;
  let databaseDeviceService: jest.Mocked<DataBaseDeviceService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeCrudService,
        {
          provide: getRepositoryToken(Recipe),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(DeviceCommand),
          useValue: {
            create: jest.fn((data) => data),
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

    service = module.get<RecipeCrudService>(RecipeCrudService);
    recipeRepository = module.get(getRepositoryToken(Recipe));
    databaseDeviceService = module.get(DataBaseDeviceService);
  });

  it('서비스가 정의되어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('saveRecipe', () => {
    it('레시피를 저장해야 합니다', async () => {
      const deviceCommand = {
        command: { test: 'test' },
        deviceId: 'device123',
        name: '장치 명령',
      };

      const createRecipeDto: CreateRecipeRequestDto = {
        name: '테스트 레시피',
        description: '테스트 설명',
        type: '테스트 타입',
        active: true,
        timer: 60,
        deviceCommands: [deviceCommand],
        recipeGroups: [],
      };

      databaseDeviceService.findInIds.mockResolvedValue([
        { id: 'device123', platform: 'platform' } as Device,
      ]);
      recipeRepository.save.mockResolvedValue({ id: 1, ...createRecipeDto });

      const result = await service.saveRecipe(createRecipeDto);

      expect(databaseDeviceService.findInIds).toHaveBeenCalledWith([
        'device123',
      ]);

      expect(recipeRepository.save).toHaveBeenCalledWith({
        ...createRecipeDto,
        deviceCommands: [{ ...deviceCommand, platform: 'platform', order: 0 }],
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
    describe('연관테이블 업데이트가 없는 경우', () => {
      const updateRecipeDto: UpdateRecipeRequestDto = {
        name: '업데이트된 레시피',
        description: '업데이트된 설명',
      };
      it('연관테이블 업데이트가 없는 경우 레시피만 업데이트해야 합니다', async () => {
        recipeRepository.update.mockResolvedValue({ affected: 1 });

        const result = await service.update(1, updateRecipeDto);

        expect(recipeRepository.update).toHaveBeenCalledWith(
          1,
          updateRecipeDto,
        );
        expect(result).toEqual(undefined);
      });

      it('존재하지 않는 레시피는 NotFoundException을 발생시켜야 합니다', async () => {
        recipeRepository.update.mockResolvedValue({ affected: 0 });

        await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
      });
    });

    describe('연관테이블 업데이트가 있는 경우', () => {
      const deviceCommand = {
        command: { test: 'test' },
        deviceId: 'device123',
        name: '장치 명령',
      };

      const updateRecipeDto: UpdateRecipeRequestDto = {
        name: '업데이트된 레시피',
        description: '업데이트된 설명',
        deviceCommands: [deviceCommand],
        recipeGroups: [],
      };

      it('연관테이블 업데이트가 있는 경우 레시피와 연관테이블을 업데이트해야 합니다', async () => {
        const existingRecipe = {
          id: 1,
          name: '기존 레시피',
          description: '기존 설명',
          deviceCommands: [],
          recipeGroups: [],
        };

        recipeRepository.findOne.mockResolvedValue(existingRecipe);
        databaseDeviceService.findInIds.mockResolvedValue([
          { id: 'device123', platform: 'platform' } as Device,
        ]);
        recipeRepository.save.mockResolvedValue({
          id: 1,
          ...updateRecipeDto,
          deviceCommands: [
            { ...deviceCommand, platform: 'platform', order: 0 },
          ],
        });

        await service.update(1, updateRecipeDto);

        expect(recipeRepository.findOne).toHaveBeenCalledWith({
          where: { id: 1 },
          relations: [
            'deviceCommands',
            'recipeGroups',
            'recipeGroups.conditions',
          ],
        });
        expect(databaseDeviceService.findInIds).toHaveBeenCalledWith([
          'device123',
        ]);
        expect(recipeRepository.save).toHaveBeenCalledWith({
          ...existingRecipe,
          ...updateRecipeDto,
          deviceCommands: [
            { ...deviceCommand, platform: 'platform', order: 0 },
          ],
        });
      });

      it('연관 테이블 업데이트가 있으나 레시피가 존재하지 않으면 NotFoundException을 발생시켜야 합니다', async () => {
        recipeRepository.findOne.mockResolvedValue(null);
        const existingRecipe = {
          id: 1,
          deviceCommands: [],
          recipeGroups: [],
        };
        await expect(service.update(1, existingRecipe)).rejects.toThrow(
          NotFoundException,
        );
      });

      it('디바이스가 존재하지 않으면 NotFoundException을 발생시켜야 합니다', async () => {
        const existingRecipe = {
          id: 1,
          deviceCommands: [],
          recipeGroups: [],
        };

        recipeRepository.findOne.mockResolvedValue(existingRecipe);
        databaseDeviceService.findInIds.mockResolvedValue([]);

        await expect(
          service.update(1, {
            deviceCommands: [deviceCommand],
          }),
        ).rejects.toThrow(NotFoundException);
      });

      it('디바이스 ID가 일치하지 않으면 NotFoundException을 발생시켜야 합니다', async () => {
        const existingRecipe = {
          id: 1,
          deviceCommands: [],
          recipeGroups: [],
        };

        recipeRepository.findOne.mockResolvedValue(existingRecipe);
        databaseDeviceService.findInIds.mockResolvedValue([
          { id: 'different_device', platform: 'platform' } as Device,
        ]);

        await expect(
          service.update(1, {
            deviceCommands: [deviceCommand],
          }),
        ).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('remove', () => {
    it('레시피를 삭제해야 합니다', async () => {
      const deleteResult = { affected: 1 };
      recipeRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(1);

      expect(recipeRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(deleteResult);
    });
  });
});
