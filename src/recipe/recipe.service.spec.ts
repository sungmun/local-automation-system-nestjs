import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RecipeService } from './recipe.service';
import { Recipe } from './entities/recipe.entity';
import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';
import { TimerManagerService } from '../timer-manager/timer-manager.service';
import { RecipeConditionService } from '../recipe-condition/recipe-condition.service';
import { DeviceCommand } from './entities/device-command.entity';

describe('RecipeService', () => {
  let service: RecipeService;
  let recipeRepository: jest.Mocked<any>;
  let hejhomeApiService: jest.Mocked<HejhomeApiService>;
  let timerManagerService: jest.Mocked<TimerManagerService>;
  let recipeConditionService: jest.Mocked<RecipeConditionService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeService,
        {
          provide: getRepositoryToken(Recipe),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: HejhomeApiService,
          useValue: {
            setDeviceControl: jest.fn(),
          },
        },
        {
          provide: TimerManagerService,
          useValue: {
            setTimer: jest.fn(),
          },
        },
        {
          provide: RecipeConditionService,
          useValue: {
            checkRecipeConditions: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RecipeService>(RecipeService);
    recipeRepository = module.get(getRepositoryToken(Recipe));
    hejhomeApiService = module.get(HejhomeApiService);
    timerManagerService = module.get(TimerManagerService);
    recipeConditionService = module.get(RecipeConditionService);
  });

  describe('runDeviceCommands', () => {
    it('장치 명령을 순차적으로 실행해야 합니다', async () => {
      const deviceCommands = [
        {
          id: 1,
          deviceId: 'device1',
          command: '{"action":"on"}',
          name: '명령1',
          platform: 'platform1',
          order: 0,
        },
        {
          id: 2,
          deviceId: 'device2',
          command: '{"action":"off"}',
          name: '명령2',
          platform: 'platform2',
          order: 1,
        },
      ] as DeviceCommand[];

      await service.runDeviceCommands(deviceCommands);

      expect(hejhomeApiService.setDeviceControl).toHaveBeenCalledTimes(2);
      expect(hejhomeApiService.setDeviceControl).toHaveBeenNthCalledWith(
        1,
        'device1',
        { requirments: { action: 'on' } },
      );
      expect(hejhomeApiService.setDeviceControl).toHaveBeenNthCalledWith(
        2,
        'device2',
        { requirments: { action: 'off' } },
      );
    });

    it('잘못된 JSON 명령어는 예외를 발생시켜야 합니다', async () => {
      const deviceCommands: DeviceCommand[] = [
        {
          deviceId: 'device1',
          command: 'invalid-json',
          name: '잘못된 명령',
          platform: 'platform1',
          order: 0,
        },
      ] as DeviceCommand[];

      const loggerSpy = jest
        .spyOn(service['logger'], 'error')
        .mockImplementation();

      await expect(service.runDeviceCommands(deviceCommands)).rejects.toThrow();
      expect(loggerSpy).toHaveBeenCalledWith(
        'Failed to parse command: invalid-json',
      );
    });
  });

  describe('runRecipe', () => {
    it('존재하지 않는 레시피는 경고 로그를 남겨야 합니다', async () => {
      recipeRepository.findOne.mockResolvedValue(null);
      const loggerSpy = jest.spyOn(service['logger'], 'warn');

      await service.runRecipe(1);

      expect(loggerSpy).toHaveBeenCalledWith('Recipe 1 not found or inactive');
    });

    it('타이머가 없는 레시피는 즉시 실행되어야 합니다', async () => {
      const recipe = {
        id: 1,
        active: true,
        timer: -1,
        deviceCommands: [{ deviceId: 'device1', command: '{"action":"on"}' }],
      };

      recipeRepository.findOne.mockResolvedValue(recipe);
      const runDeviceCommandsSpy = jest.spyOn(service, 'runDeviceCommands');

      await service.runRecipe(1);

      expect(runDeviceCommandsSpy).toHaveBeenCalledWith(recipe.deviceCommands);
    });

    it('타이머가 있는 레시피는 타이머를 설정해야 합니다', async () => {
      const recipe = {
        id: 1,
        active: true,
        timer: 60,
        deviceCommands: [{ deviceId: 'device1', command: '{"action":"on"}' }],
      };

      recipeRepository.findOne.mockResolvedValue(recipe);
      timerManagerService.setTimer.mockReturnValue(true);

      await service.runRecipe(1);

      expect(timerManagerService.setTimer).toHaveBeenCalledWith(
        'recipe-1',
        expect.any(Function),
        60,
      );
    });

    it('타이머 설정에 실패하면 즉시 실행되어야 합니다', async () => {
      const recipe = {
        id: 1,
        active: true,
        timer: 60,
        deviceCommands: [{ deviceId: 'device1', command: '{"action":"on"}' }],
      };

      recipeRepository.findOne.mockResolvedValue(recipe);
      timerManagerService.setTimer.mockReturnValue(false);
      const runDeviceCommandsSpy = jest.spyOn(service, 'runDeviceCommands');

      await service.runRecipe(1);

      expect(runDeviceCommandsSpy).toHaveBeenCalledWith(recipe.deviceCommands);
    });
  });

  describe('recipeCheck', () => {
    it('레시피가 없으면 undefined를 반환해야 합니다', async () => {
      recipeRepository.findOne.mockResolvedValue(null);

      const result = await service.recipeCheck(1);

      expect(result).toBeUndefined();
    });

    it('레시피 조건을 확인해야 합니다', async () => {
      const recipe = {
        id: 1,
        active: true,
        recipeGroups: [{ conditions: [] }],
      };

      recipeRepository.findOne.mockResolvedValue(recipe);
      recipeConditionService.checkRecipeConditions.mockResolvedValue(true);

      const result = await service.recipeCheck(1);

      expect(recipeConditionService.checkRecipeConditions).toHaveBeenCalledWith(
        recipe.recipeGroups,
      );
      expect(result).toBeTruthy();
    });
  });
});
