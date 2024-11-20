import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RecipeCommandService } from './recipe-command.service';
import { Recipe } from './entities/recipe.entity';
import { HejhomeApiService } from './../hejhome-api/hejhome-api.service';
import { TimerManagerService } from './../timer-manager/timer-manager.service';
import { RecipeConditionService } from './../recipe-condition/recipe-condition.service';
import {
  RecipeNotFoundException,
  RecipeInactiveException,
} from './recipe.exception';

describe('RecipeCommandService', () => {
  let service: RecipeCommandService;
  let recipeRepository: jest.Mocked<any>;
  let hejhomeApiService: jest.Mocked<HejhomeApiService>;
  let timerManagerService: jest.Mocked<TimerManagerService>;
  let recipeConditionService: jest.Mocked<RecipeConditionService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeCommandService,
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

    service = module.get<RecipeCommandService>(RecipeCommandService);
    recipeRepository = module.get(getRepositoryToken(Recipe));
    hejhomeApiService = module.get(HejhomeApiService);
    timerManagerService = module.get(TimerManagerService);
    recipeConditionService = module.get(RecipeConditionService);
  });

  describe('runRecipe', () => {
    it('레시피가 존재하지 않으면 예외를 발생시켜야 합니다', async () => {
      recipeRepository.findOne.mockResolvedValue(null);

      await expect(service.runRecipe(1)).rejects.toThrow(
        RecipeNotFoundException,
      );
    });

    it('비활성화된 레시피는 예외를 발생시켜야 합니다', async () => {
      recipeRepository.findOne.mockResolvedValue({ active: false });

      await expect(service.runRecipe(1)).rejects.toThrow(
        RecipeInactiveException,
      );
    });

    it('타이머가 없는 레시피는 즉시 실행되어야 합니다', async () => {
      const recipe = {
        id: 1,
        active: true,
        timer: -1,
        deviceCommands: [{ deviceId: 'device1', command: '{"action":"on"}' }],
      };

      recipeRepository.findOne.mockResolvedValue(recipe);

      await service.runRecipe(1);

      expect(hejhomeApiService.setDeviceControl).toHaveBeenCalledWith(
        'device1',
        expect.any(Object),
      );
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
      expect(hejhomeApiService.setDeviceControl).not.toHaveBeenCalled();
    });
  });

  describe('recipeCheck', () => {
    it('레시피가 존재하지 않으면 예외를 발생시켜야 합니다', async () => {
      recipeRepository.findOne.mockResolvedValue(null);

      await expect(service.recipeCheck(1)).rejects.toThrow();
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

  describe('명령어 파싱 실패', () => {
    it('잘못된 JSON 명령어는 예외를 발생시켜야 합니다', async () => {
      const recipe = {
        id: 1,
        active: true,
        timer: -1,
        deviceCommands: [{ deviceId: 'device1', command: 'invalid-json' }],
      };
      recipeRepository.findOne.mockResolvedValue(recipe);

      await expect(service.runRecipe(1)).rejects.toThrow();
    });
  });
});
