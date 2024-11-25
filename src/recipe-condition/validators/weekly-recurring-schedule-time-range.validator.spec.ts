import { WeeklyRecurringScheduleTimeRangeValidator } from './weekly-recurring-schedule-time-range.validator';
import {
  RecipeCondition,
  RecipeConditionType,
} from '../entities/recipe-condition.entity';
import { ValidationContext } from './validation-context';

describe('WeeklyRecurringScheduleTimeRangeValidator', () => {
  let validator: WeeklyRecurringScheduleTimeRangeValidator;

  beforeEach(() => {
    validator = new WeeklyRecurringScheduleTimeRangeValidator();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('canHandle', () => {
    it('주간 반복 스케줄 시간 범위 타입의 조건을 처리할 수 있어야 합니다', () => {
      const condition = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE,
      } as RecipeCondition;

      expect(validator.canHandle(condition)).toBe(true);
    });

    it('주간 반복 스케줄 시간 범위 타입이 아닌 조건은 처리할 수 없어야 합니다', () => {
      const condition = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE,
      } as RecipeCondition;

      expect(validator.canHandle(condition)).toBe(false);
    });
  });

  describe('validate', () => {
    it('현재 요일과 시간이 조건 범위 내에 있으면 true를 반환해야 합니다', async () => {
      const now = new Date('2024-01-15T10:00:00.000Z'); // 월요일 10:00
      jest.setSystemTime(now);

      const condition = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE,
        dayOfWeeks: '1', // 월요일
        startTime: '09:00',
        endTime: '11:00',
      } as unknown as RecipeCondition;

      const context = new ValidationContext(condition);
      const result = await validator.validate(context);

      expect(result).toBe(true);
    });

    it('현재 요일이 일치하지 않으면 false를 반환해야 합니다', async () => {
      const now = new Date('2024-01-16T10:00:00.000Z'); // 화요일 10:00
      jest.setSystemTime(now);

      const condition = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE,
        dayOfWeeks: '1', // 월요일
        startTime: '09:00',
        endTime: '11:00',
      } as unknown as RecipeCondition;

      const context = new ValidationContext(condition);
      const result = await validator.validate(context);

      expect(result).toBe(false);
    });

    it('현재 시간이 범위를 벗어나면 false를 반환해야 합니다', async () => {
      const now = new Date('2024-01-15T12:00:00.000Z'); // 월요일 12:00
      jest.setSystemTime(now);

      const condition = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE,
        dayOfWeeks: '1', // 월요일
        startTime: '09:00',
        endTime: '11:00',
      } as unknown as RecipeCondition;

      const context = new ValidationContext(condition);
      const result = await validator.validate(context);

      expect(result).toBe(false);
    });

    it('여러 요일이 포함된 경우 현재 요일이 포함되어 있고 시간이 범위 내에 있으면 true를 반환해야 합니다', async () => {
      const now = new Date('2024-01-15T10:00:00.000Z'); // 월요일 10:00
      jest.setSystemTime(now);

      const condition = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE,
        dayOfWeeks: '1,3,5', // 월,수,금
        startTime: '09:00',
        endTime: '11:00',
      } as unknown as RecipeCondition;

      const context = new ValidationContext(condition);
      const result = await validator.validate(context);

      expect(result).toBe(true);
    });

    it('시작 시간이 종료 시간보다 큰 경우(자정을 걸치는 경우)에도 올바르게 처리해야 합니다', async () => {
      const now = new Date('2024-01-15T23:30:00.000Z'); // 월요일 23:30
      jest.setSystemTime(now);

      const condition = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE,
        dayOfWeeks: '1', // 월요일
        startTime: '23:00',
        endTime: '01:00',
      } as unknown as RecipeCondition;

      const context = new ValidationContext(condition);
      const result = await validator.validate(context);

      expect(result).toBe(true);
    });

    it('밀리초와 초는 무시하고 비교해야 합니다', async () => {
      const now = new Date('2024-01-15T10:00:45.123Z'); // 월요일 10:00:45.123
      jest.setSystemTime(now);

      const condition = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE,
        dayOfWeeks: '1',
        startTime: '10:00',
        endTime: '11:00',
      } as unknown as RecipeCondition;

      const context = new ValidationContext(condition);
      const result = await validator.validate(context);

      expect(result).toBe(true);
    });
  });
});
