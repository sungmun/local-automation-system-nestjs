import { DailyRecurringScheduleValidator } from './daily-recurring-schedule.validator';
import {
  RecipeCondition,
  RecipeConditionType,
} from '../entities/recipe-condition.entity';
import { ValidationContext } from './validation-context';

describe('DailyRecurringScheduleValidator', () => {
  let validator: DailyRecurringScheduleValidator;

  beforeEach(() => {
    validator = new DailyRecurringScheduleValidator();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('검증 가능한 클래스가 정의되어야 한다', () => {
    expect(validator).toBeDefined();
  });

  describe('canHandle', () => {
    it('일일 반복 스케줄 타입의 조건을 처리할 수 있어야 합니다', () => {
      const condition = {
        type: RecipeConditionType.DAILY_RECURRING_SCHEDULE,
      } as RecipeCondition;

      expect(validator.canHandle(condition)).toBe(true);
    });

    it('일일 반복 스케줄 타입이 아닌 조건은 처리할 수 없어야 합니다', () => {
      const condition = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
      } as RecipeCondition;

      expect(validator.canHandle(condition)).toBe(false);
    });
  });

  describe('validate', () => {
    it('현재 시간이 조건과 일치하면 true를 반환해야 합니다', async () => {
      const now = new Date('2024-01-15T10:00:00+09:00'); // 10:00
      jest.setSystemTime(now);

      const condition = {
        type: RecipeConditionType.DAILY_RECURRING_SCHEDULE,
        time: '10:00:00',
      } as unknown as RecipeCondition;

      const context = new ValidationContext(condition);
      const result = await validator.validate(context);

      expect(result).toBe(true);
    });

    it('현재 시간이 일치하지 않으면 false를 반환해야 합니다', async () => {
      const now = new Date('2024-01-15T11:00:00+09:00'); // 11:00
      jest.setSystemTime(now);

      const condition = {
        type: RecipeConditionType.DAILY_RECURRING_SCHEDULE,
        time: '10:00:00',
      } as unknown as RecipeCondition;

      const context = new ValidationContext(condition);
      const result = await validator.validate(context);

      expect(result).toBe(false);
    });

    it('밀리초와 초는 무시하고 비교해야 합니다', async () => {
      const now = new Date('2024-01-15T10:00:45+09:00'); // 10:00:45
      jest.setSystemTime(now);

      const condition = {
        type: RecipeConditionType.DAILY_RECURRING_SCHEDULE,
        time: '10:00:00',
      } as unknown as RecipeCondition;

      const context = new ValidationContext(condition);
      const result = await validator.validate(context);

      expect(result).toBe(true);
    });

    it('다른 날짜여도 같은 시간이면 true를 반환해야 합니다', async () => {
      const now = new Date('2024-01-16T10:00:00+09:00'); // 다음날 10:00
      jest.setSystemTime(now);

      const condition = {
        type: RecipeConditionType.DAILY_RECURRING_SCHEDULE,
        time: '10:00:00',
      } as unknown as RecipeCondition;

      const context = new ValidationContext(condition);
      const result = await validator.validate(context);

      expect(result).toBe(true);
    });
  });
});
