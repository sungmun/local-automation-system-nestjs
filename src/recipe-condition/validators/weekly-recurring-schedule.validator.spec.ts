import { WeeklyRecurringScheduleValidator } from './weekly-recurring-schedule.validator';
import {
  RecipeCondition,
  RecipeConditionType,
} from '../entities/recipe-condition.entity';
import { ValidationContext } from './validation-context';

describe('WeeklyRecurringScheduleValidator', () => {
  let validator: WeeklyRecurringScheduleValidator;

  beforeEach(() => {
    validator = new WeeklyRecurringScheduleValidator();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('canHandle', () => {
    it('주간 반복 스케줄 타입의 조건을 처리할 수 있어야 합니다', () => {
      const condition = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE,
      } as RecipeCondition;

      expect(validator.canHandle(condition)).toBe(true);
    });

    it('주간 반복 스케줄 타입이 아닌 조건은 처리할 수 없어야 합니다', () => {
      const condition = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
      } as RecipeCondition;

      expect(validator.canHandle(condition)).toBe(false);
    });
  });

  describe('validate', () => {
    it('현재 요일과 시간이 조건과 일치하면 true를 반환해야 합니다', async () => {
      const now = new Date('2024-01-15T10:00:00.000Z'); // 월요일 10:00
      jest.setSystemTime(now);

      const condition = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE,
        dayOfWeeks: '1', // 월요일
        time: '2024-01-15T10:00:00.000Z',
      } as unknown as RecipeCondition;

      const context = new ValidationContext(condition);
      const result = await validator.validate(context);

      expect(result).toBe(true);
    });

    it('현재 요일이 일치하지 않으면 false를 반환해야 합니다', async () => {
      const now = new Date('2024-01-16T10:00:00.000Z'); // 화요일 10:00
      jest.setSystemTime(now);

      const condition = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE,
        dayOfWeeks: '1', // 월요일
        time: '2024-01-15T10:00:00.000Z',
      } as unknown as RecipeCondition;

      const context = new ValidationContext(condition);
      const result = await validator.validate(context);

      expect(result).toBe(false);
    });

    it('현재 시간이 일치하지 않으면 false를 반환해야 합니다', async () => {
      const now = new Date('2024-01-15T11:00:00.000Z'); // 월요일 11:00
      jest.setSystemTime(now);

      const condition = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE,
        dayOfWeeks: '1', // 월요일
        time: '2024-01-15T10:00:00.000Z', // 10:00
      } as unknown as RecipeCondition;

      const context = new ValidationContext(condition);
      const result = await validator.validate(context);

      expect(result).toBe(false);
    });

    it('여러 요일이 포함된 경우 현재 요일이 포함되어 있으면 true를 반환해야 합니다', async () => {
      const now = new Date('2024-01-15T10:00:00.000Z'); // 월요일 10:00
      jest.setSystemTime(now);

      const condition = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE,
        dayOfWeeks: '1,3,5', // 월,수,금
        time: '2024-01-15T10:00:00.000Z',
      } as unknown as RecipeCondition;

      const context = new ValidationContext(condition);
      const result = await validator.validate(context);

      expect(result).toBe(true);
    });

    it('밀리초와 초는 무시하고 비교해야 합니다', async () => {
      const now = new Date('2024-01-15T10:00:45.123Z'); // 월요일 10:00:45.123
      jest.setSystemTime(now);

      const condition = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE,
        dayOfWeeks: '1',
        time: '2024-01-15T10:00:00.000Z',
      } as unknown as RecipeCondition;

      const context = new ValidationContext(condition);
      const result = await validator.validate(context);

      expect(result).toBe(true);
    });
  });
});
