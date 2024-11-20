import { Test, TestingModule } from '@nestjs/testing';
import { ConditionValidatorFactory } from './condition-validator.factory';
import { IConditionValidator } from './condition-validator.interface';
import {
  RecipeCondition,
  RecipeConditionType,
} from '../entities/recipe-condition.entity';

describe('ConditionValidatorFactory', () => {
  let factory: ConditionValidatorFactory;
  let mockTemperatureValidator: IConditionValidator;
  let mockHumidityValidator: IConditionValidator;

  beforeEach(async () => {
    mockTemperatureValidator = {
      canHandle: jest.fn(
        (condition) => condition.type === RecipeConditionType.ROOM_TEMPERATURE,
      ),
      validate: jest.fn(),
    };

    mockHumidityValidator = {
      canHandle: jest.fn(
        (condition) => condition.type === RecipeConditionType.ROOM_HUMIDITY,
      ),
      validate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConditionValidatorFactory,
        {
          provide: 'CONDITION_VALIDATORS',
          useValue: [mockTemperatureValidator, mockHumidityValidator],
        },
      ],
    }).compile();

    factory = module.get<ConditionValidatorFactory>(ConditionValidatorFactory);
  });

  describe('getValidator', () => {
    it('온도 조건에 대한 올바른 validator를 반환해야 합니다', () => {
      const condition = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
      } as RecipeCondition;

      const validator = factory.getValidator(condition);

      expect(mockTemperatureValidator.canHandle).toHaveBeenCalledWith(
        condition,
      );
      expect(validator).toBe(mockTemperatureValidator);
    });

    it('습도 조건에 대한 올바른 validator를 반환해야 합니다', () => {
      const condition = {
        type: RecipeConditionType.ROOM_HUMIDITY,
      } as RecipeCondition;

      const validator = factory.getValidator(condition);

      expect(mockHumidityValidator.canHandle).toHaveBeenCalledWith(condition);
      expect(validator).toBe(mockHumidityValidator);
    });

    it('지원하지 않는 조건 타입에 대해 예외를 발생시켜야 합니다', () => {
      const condition = {
        type: 'UNSUPPORTED_TYPE',
      } as unknown as RecipeCondition;

      expect(() => factory.getValidator(condition)).toThrow(
        'No validator found for condition type: UNSUPPORTED_TYPE',
      );
    });
  });
});
