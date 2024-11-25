import { ReserveTimeValidator } from './reserve-time.validator';
import {
  RecipeCondition,
  RecipeConditionType,
} from '../entities/recipe-condition.entity';
import { ValidationContext } from './validation-context';

describe('ReserveTimeValidator', () => {
  let validator: ReserveTimeValidator;

  beforeEach(() => {
    validator = new ReserveTimeValidator();
  });

  describe('canHandle', () => {
    it('예약 시간 타입의 조건을 처리할 수 있어야 합니다', () => {
      const condition = {
        type: RecipeConditionType.RESERVE_TIME,
      } as RecipeCondition;

      expect(validator.canHandle(condition)).toBe(true);
    });

    it('예약 시간 타입이 아닌 조건은 처리할 수 없어야 합니다', () => {
      const condition = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
      } as RecipeCondition;

      expect(validator.canHandle(condition)).toBe(false);
    });
  });

  describe('validate', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('현재 시간이 예약 시간과 일치하면 true를 반환해야 합니다', async () => {
      const now = new Date('2024-01-15T10:00:00.000Z');
      jest.setSystemTime(now);

      const condition = {
        type: RecipeConditionType.RESERVE_TIME,
        reserveTime: '2024-01-15T10:00:00.000Z',
      } as unknown as RecipeCondition;

      const context = new ValidationContext(condition);
      const result = await validator.validate(context);

      expect(result).toBe(true);
    });

    it('현재 시간이 예약 시간과 일치하지 않으면 false를 반환해야 합니다', async () => {
      const now = new Date('2024-01-15T10:00:00.000Z');
      jest.setSystemTime(now);

      const condition = {
        type: RecipeConditionType.RESERVE_TIME,
        reserveTime: '2024-01-15T11:00:00.000Z',
      } as unknown as RecipeCondition;

      const context = new ValidationContext(condition);
      const result = await validator.validate(context);

      expect(result).toBe(false);
    });

    it('밀리초와 초는 무시하고 비교해야 합니다', async () => {
      const now = new Date('2024-01-15T10:00:00.123Z');
      jest.setSystemTime(now);

      const condition = {
        type: RecipeConditionType.RESERVE_TIME,
        reserveTime: '2024-01-15T10:00:00.000Z',
      } as unknown as RecipeCondition;

      const context = new ValidationContext(condition);
      const result = await validator.validate(context);

      expect(result).toBe(true);
    });

    it('예약 시간이 유효하지 않으면 false를 반환해야 합니다', async () => {
      const now = new Date('2024-01-15T10:00:00.000Z');
      jest.setSystemTime(now);

      const condition = {
        type: RecipeConditionType.RESERVE_TIME,
        reserveTime: 'invalid-date',
      } as unknown as RecipeCondition;

      const context = new ValidationContext(condition);
      const result = await validator.validate(context);

      expect(result).toBe(false);
    });
  });
});
