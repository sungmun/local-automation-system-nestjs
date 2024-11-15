import { TemperatureValidator } from './temperature.validator';
import { ValidationContext } from './validation-context';
import {
  RecipeCondition,
  RecipeConditionType,
} from '../entities/recipe-condition.entity';
import { Room } from '../../room/entities/room.entity';

describe('TemperatureValidator', () => {
  let validator: TemperatureValidator;

  beforeEach(() => {
    validator = new TemperatureValidator();
  });

  describe('canHandle', () => {
    it('온도 타입의 조건을 처리할 수 있어야 합니다', () => {
      const condition = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
      } as unknown as RecipeCondition;

      expect(validator.canHandle(condition)).toBe(true);
    });

    it('온도 타입이 아닌 조건은 처리할 수 없어야 합니다', () => {
      const condition = {
        type: RecipeConditionType.ROOM_HUMIDITY,
      } as unknown as RecipeCondition;

      expect(validator.canHandle(condition)).toBe(false);
    });
  });

  describe('validate', () => {
    it('온도 조건이 충족되면 true를 반환해야 합니다', async () => {
      const condition = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
        temperature: 2500,
        unit: '>',
      } as unknown as RecipeCondition;

      const room = {
        temperature: 2600,
      } as Room;

      const context = new ValidationContext(condition, { room });

      const result = await validator.validate(context);
      expect(result).toBe(true);
    });

    it('온도 조건이 충족되지 않으면 false를 반환해야 합니다', async () => {
      const condition = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
        temperature: 2500,
        unit: '>',
      } as unknown as RecipeCondition;

      const room = {
        temperature: 2400,
      } as Room;

      const context = new ValidationContext(condition, { room });

      const result = await validator.validate(context);
      expect(result).toBe(false);
    });

    it('room 데이터가 없으면 예외를 발생시켜야 합니다', async () => {
      const condition = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
        temperature: 2500,
        unit: '>',
      } as unknown as RecipeCondition;

      const context = new ValidationContext(condition);

      await expect(validator.validate(context)).rejects.toThrow(
        'Room data is required for temperature validation',
      );
    });
  });
});
