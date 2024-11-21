import { Test, TestingModule } from '@nestjs/testing';
import { RecipeConditionService } from './recipe-condition.service';
import { ConditionValidatorFactory } from './validators/condition-validator.factory';
import { IConditionValidator } from './validators/condition-validator.interface';
import {
  RecipeCondition,
  RecipeConditionType,
} from './entities/recipe-condition.entity';
import { RecipeConditionGroup } from './entities/recipe-condition-group.entity';
import { Room } from '../room/entities/room.entity';
import { NotAcceptableException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('RecipeConditionService', () => {
  let service: RecipeConditionService;
  let validatorFactory: jest.Mocked<ConditionValidatorFactory>;
  let mockValidator: jest.Mocked<IConditionValidator>;
  let recipeConditionRepository: jest.Mocked<Repository<RecipeCondition>>;

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
        {
          provide: getRepositoryToken(RecipeCondition),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RecipeConditionService>(RecipeConditionService);
    validatorFactory = module.get(ConditionValidatorFactory);
    recipeConditionRepository = module.get(getRepositoryToken(RecipeCondition));
  });

  describe('findRecipeConditionsAndGroupByTypeIn', () => {
    it('지정된 타입의 레시피 조건을 조회해야 합니다', async () => {
      const types = [RecipeConditionType.RESERVE_TIME];
      const expectedConditions = [
        { id: 1, type: RecipeConditionType.RESERVE_TIME },
      ] as RecipeCondition[];

      recipeConditionRepository.find.mockResolvedValue(expectedConditions);

      const result = await service.findRecipeConditionsAndGroupByTypeIn(types);

      expect(recipeConditionRepository.find).toHaveBeenCalledWith({
        where: { type: expect.any(Object) },
        relations: ['group'],
      });
      expect(result).toEqual(expectedConditions);
    });
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
  });

  describe('checkReserveTimeRecipeConditions', () => {
    it('유효한 조건의 레시피 ID를 반환해야 합니다', async () => {
      const conditions = [
        {
          group: { recipeId: 1 },
          type: RecipeConditionType.RESERVE_TIME,
        },
        {
          group: { recipeId: 2 },
          type: RecipeConditionType.RESERVE_TIME,
        },
      ] as RecipeCondition[];

      mockValidator.validate
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);

      const result = await service.checkReserveTimeRecipeConditions(conditions);
      expect(result).toEqual([1]);
    });

    it('그룹이 없는 조건은 무시해야 합니다', async () => {
      const conditions = [
        {
          type: RecipeConditionType.RESERVE_TIME,
        },
      ] as RecipeCondition[];

      const result = await service.checkReserveTimeRecipeConditions(conditions);
      expect(result).toEqual([]);
    });
  });

  describe('checkRoomRecipeConditions', () => {
    it('온도와 습도 조건이 없으면 빈 배열을 반환해야 합니다', async () => {
      const room = {
        recipeConditionsTemperature: [],
        recipeConditionsHumidity: [],
      } as Room;

      const result = await service.checkRoomRecipeConditions(room);
      expect(result).toEqual([]);
    });

    it('유효한 조건의 레시피 ID를 반환해야 합니다', async () => {
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

      mockValidator.validate
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true);

      const result = await service.checkRoomRecipeConditions(room);
      expect(result).toEqual([1, 2]);
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
