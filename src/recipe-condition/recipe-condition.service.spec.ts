import { Test, TestingModule } from '@nestjs/testing';
import { Logger, NotAcceptableException } from '@nestjs/common';
import { RecipeConditionService } from './recipe-condition.service';
import { ConditionValidatorFactory } from './validators/condition-validator.factory';
import { RecipeConditionGroup } from './entities/recipe-condition-group.entity';
import {
  RecipeCondition,
  RecipeConditionType,
} from './entities/recipe-condition.entity';
import { Room } from '../room/entities/room.entity';

import { IConditionValidator } from './validators/condition-validator.interface';

describe('RecipeConditionService', () => {
  let service: RecipeConditionService;
  let validatorFactory: jest.Mocked<ConditionValidatorFactory>;
  let mockValidator: jest.Mocked<IConditionValidator>;

  beforeEach(async () => {
    mockValidator = {
      canHandle: jest.fn().mockReturnValue(true),
      validate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeConditionService,
        {
          provide: ConditionValidatorFactory,
          useValue: {
            getValidator: jest.fn().mockReturnValue(mockValidator),
          },
        },
      ],
    }).compile();

    service = module.get<RecipeConditionService>(RecipeConditionService);
    validatorFactory = module.get(ConditionValidatorFactory);
  });

  describe('checkRecipeConditions', () => {
    it('모든 조건이 충족되면 true를 반환해야 합니다', async () => {
      const recipeGroups = [
        {
          operator: 'AND',
          conditions: [
            { type: RecipeConditionType.ROOM_TEMPERATURE } as RecipeCondition,
          ],
        },
      ] as RecipeConditionGroup[];

      mockValidator.validate.mockResolvedValue(true);

      const result = await service.checkRecipeConditions(recipeGroups);
      expect(result).toBe(true);
    });

    it('조건이 충족되지 않으면 false를 반환해야 합니다', async () => {
      const recipeGroups = [
        {
          operator: 'AND',
          conditions: [
            { type: RecipeConditionType.ROOM_TEMPERATURE } as RecipeCondition,
          ],
        },
      ] as RecipeConditionGroup[];

      mockValidator.validate.mockResolvedValue(false);

      const result = await service.checkRecipeConditions(recipeGroups);
      expect(result).toBe(false);
    });

    it('에러 발생 시 로그를 기록하고 false를 반환해야 합니다', async () => {
      const recipeGroups = [
        {
          operator: 'AND',
          conditions: [
            { type: RecipeConditionType.ROOM_TEMPERATURE } as RecipeCondition,
          ],
        },
      ] as RecipeConditionGroup[];

      mockValidator.validate.mockRejectedValue(new Error('테스트 에러'));
      const loggerSpy = jest.spyOn(Logger.prototype, 'error');

      const result = await service.checkRecipeConditions(recipeGroups);

      expect(result).toBe(false);
      expect(loggerSpy).toHaveBeenCalled();
    });
  });

  describe('checkRoomRecipeConditions', () => {
    it('조건이 없는 경우 빈 배열을 반환해야 합니다', async () => {
      const room = {
        recipeConditionsTemperature: [],
        recipeConditionsHumidity: [],
      } as Room;

      const result = await service.checkRoomRecipeConditions(room);
      expect(result).toEqual([]);
    });

    it('충족된 조건의 레시피 ID를 반환해야 합니다', async () => {
      const room = {
        recipeConditionsTemperature: [
          {
            group: { recipeId: 1 },
            type: RecipeConditionType.ROOM_TEMPERATURE,
          },
        ],
        recipeConditionsHumidity: [
          {
            group: { recipeId: 2 },
            type: RecipeConditionType.ROOM_HUMIDITY,
          },
        ],
      } as unknown as Room;

      mockValidator.validate.mockResolvedValue(true);

      const result = await service.checkRoomRecipeConditions(room);
      expect(result).toEqual([1, 2]);
    });

    it('group이 없는 조건은 무시해야 합니다', async () => {
      const room = {
        recipeConditionsTemperature: [
          {
            type: RecipeConditionType.ROOM_TEMPERATURE,
          },
        ],
        recipeConditionsHumidity: [],
      } as unknown as Room;

      const result = await service.checkRoomRecipeConditions(room);
      expect(result).toEqual([]);
    });

    it('조건이 충족되지 않은 레시피 ID는 제외해야 합니다', async () => {
      const room = {
        recipeConditionsTemperature: [
          {
            group: { recipeId: 1 },
            type: RecipeConditionType.ROOM_TEMPERATURE,
          },
        ],
        recipeConditionsHumidity: [],
      } as unknown as Room;

      mockValidator.validate.mockResolvedValue(false);

      const result = await service.checkRoomRecipeConditions(room);
      expect(result).toEqual([]);
    });
  });

  describe('validateGroupResults', () => {
    it('AND 연산자에서 모든 결과가 true이면 예외가 발생하지 않아야 합니다', () => {
      const group = { operator: 'AND' } as RecipeConditionGroup;
      const results = [true, true, true];

      expect(() =>
        (service as any).validateGroupResults(group, results),
      ).not.toThrow();
    });

    it('OR 연산자에서 하나라도 true이면 예외가 발생하지 않아야 합니다', () => {
      const group = { operator: 'OR' } as RecipeConditionGroup;
      const results = [false, true, false];

      expect(() =>
        (service as any).validateGroupResults(group, results),
      ).not.toThrow();
    });

    it('조건이 충족되지 않으면 NotAcceptableException을 발생시켜야 합니다', () => {
      const group = { operator: 'AND' } as RecipeConditionGroup;
      const results = [true, false, true];

      expect(() =>
        (service as any).validateGroupResults(group, results),
      ).toThrow(NotAcceptableException);
    });
  });
});
