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
import { RecipeConditionHejHomeDeviceState } from './entities/child-recipe-conditions';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('RecipeConditionService', () => {
  let service: RecipeConditionService;
  let mockValidator: jest.Mocked<IConditionValidator>;
  let recipeConditionRepository: jest.Mocked<Repository<RecipeCondition>>;
  let recipeConditionHejHomeDeviceStateRepository: jest.Mocked<
    Repository<RecipeConditionHejHomeDeviceState>
  >;
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
        {
          provide: getRepositoryToken(RecipeConditionHejHomeDeviceState),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RecipeConditionService>(RecipeConditionService);

    recipeConditionRepository = module.get(getRepositoryToken(RecipeCondition));
    recipeConditionHejHomeDeviceStateRepository = module.get(
      getRepositoryToken(RecipeConditionHejHomeDeviceState),
    );
  });

  it('서비스가 정의되어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('validateHejHomeDeviceStateByDeviceId', () => {
    it('장치 ID로 조건을 검증하고 이벤트를 발생시켜야 합니다', async () => {
      const deviceId = 'device123';
      const condition = {
        deviceId,
        type: RecipeConditionType.HEJ_HOME_DEVICE_STATE,
        group: { recipeId: 1 },
      } as RecipeConditionHejHomeDeviceState;

      recipeConditionHejHomeDeviceStateRepository.findOne.mockResolvedValue(
        condition,
      );
      mockValidator.validate.mockResolvedValue(true);
      const eventEmitterSpy = jest.spyOn(service['eventEmitter'], 'emit');
      const result =
        await service.validateHejHomeDeviceStateByDeviceId(deviceId);

      expect(
        recipeConditionHejHomeDeviceStateRepository.findOne,
      ).toHaveBeenCalledWith({
        where: { deviceId },
        relations: { group: true },
      });
      expect(mockValidator.validate).toHaveBeenCalledWith(
        expect.objectContaining({
          condition,
        }),
      );
      expect(result).toBe(true);
      expect(eventEmitterSpy).toHaveBeenCalledWith(
        'recipe.condition.check',
        condition.group,
      );
    });

    it('조건이 유효하지 않으면 false를 반환해야 합니다', async () => {
      const deviceId = 'device123';
      const condition = {
        deviceId,
        type: RecipeConditionType.HEJ_HOME_DEVICE_STATE,
      } as RecipeConditionHejHomeDeviceState;
      const eventEmitterSpy = jest.spyOn(service['eventEmitter'], 'emit');
      recipeConditionHejHomeDeviceStateRepository.findOne.mockResolvedValue(
        condition,
      );
      mockValidator.validate.mockResolvedValue(false);

      const result =
        await service.validateHejHomeDeviceStateByDeviceId(deviceId);

      expect(eventEmitterSpy).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('조건이 없으면 false를 반환해야 합니다', async () => {
      const deviceId = 'device123';
      const eventEmitterSpy = jest.spyOn(service['eventEmitter'], 'emit');

      recipeConditionHejHomeDeviceStateRepository.findOne.mockResolvedValue(
        null,
      );

      const result =
        await service.validateHejHomeDeviceStateByDeviceId(deviceId);

      expect(
        recipeConditionHejHomeDeviceStateRepository.findOne,
      ).toHaveBeenCalledWith({
        where: { deviceId },
        relations: { group: true },
      });
      expect(mockValidator.validate).not.toHaveBeenCalled();
      expect(eventEmitterSpy).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });
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

    it('그룹이 없는 조건은 무시해야 합니다', async () => {
      const room = {
        recipeConditionsTemperature: [
          {
            type: RecipeConditionType.ROOM_TEMPERATURE,
          },
        ],
        recipeConditionsHumidity: [
          {
            type: RecipeConditionType.ROOM_HUMIDITY,
            group: { recipeId: 1 },
          },
        ],
      } as unknown as Room;

      mockValidator.validate.mockResolvedValue(true);

      const result = await service.checkRoomRecipeConditions(room);
      expect(result).toEqual([1]);
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

  describe('validateGroupConditions', () => {
    it('room 속성이 있는 조건을 올바르게 처리해야 합니다', async () => {
      const room = { id: 1 } as Room;
      const group = {
        conditions: [
          {
            type: RecipeConditionType.ROOM_TEMPERATURE,
            room,
          },
        ],
      } as unknown as RecipeConditionGroup;

      mockValidator.validate.mockResolvedValue(true);

      const result = await (service as any).validateGroupConditions(group);
      expect(result).toEqual([true]);
      expect(mockValidator.validate).toHaveBeenCalledWith(
        expect.objectContaining({
          condition: expect.objectContaining({ room }),
        }),
      );
    });

    it('room 속성이 없는 조건을 올바르게 처리해야 합니다', async () => {
      const group = {
        conditions: [
          {
            type: RecipeConditionType.RESERVE_TIME,
          },
        ],
      } as RecipeConditionGroup;

      mockValidator.validate.mockResolvedValue(true);

      const result = await (service as any).validateGroupConditions(group);
      expect(result).toEqual([true]);
    });
  });

  describe('handleError', () => {
    it('NotAcceptableException이 아닌 에러는 로그를 기록해야 합니다', () => {
      const error = new Error('테스트 에러');
      const recipeGroups = [
        {
          operator: 'AND',
          conditions: [],
        },
      ] as RecipeConditionGroup[];

      const loggerSpy = jest
        .spyOn(service['logger'], 'error')
        .mockImplementation();

      (service as any).handleError(error, recipeGroups);

      expect(loggerSpy).toHaveBeenCalledWith(
        'checkRecipeConditions error',
        error,
        JSON.stringify(recipeGroups),
      );
    });

    it('NotAcceptableException은 로그를 기록하지 않아야 합니다', () => {
      const error = new NotAcceptableException('테스트 에러');
      const recipeGroups = [] as RecipeConditionGroup[];

      const loggerSpy = jest
        .spyOn(service['logger'], 'error')
        .mockImplementation();

      service['handleError'](error, recipeGroups);

      expect(loggerSpy).not.toHaveBeenCalled();
    });
  });
});
