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

  it('검증 가능한 클래스가 정의되어야 한다', () => {
    expect(validator).toBeDefined();
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
      const now = new Date('2024-01-15T10:00:00+09:00'); // 월요일 10:00
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
      const now = new Date('2024-01-16T10:00:00+09:00'); // 화요일 10:00
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
      const now = new Date('2024-01-15T12:00:00+09:00'); // 월요일 12:00
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
      const now = new Date('2024-01-15T10:00:00+09:00'); // 월요일 10:00
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
      const now = new Date('2024-01-15T23:30:00+09:00'); // 월요일 23:30
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
      const now = new Date('2024-01-15T10:00:45+09:00'); // 월요일 10:00:45
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

  describe('시간 범위가 자정을 걸치는 경우를 올바르게 처리해야 합니다', () => {
    const testCases = [
      {
        currentTime: new Date('2024-01-15T23:30:00+09:00'),
        startTime: '23:00',
        endTime: '01:00',
        dayOfWeeks: '1',
        expected: true,
      },
      {
        currentTime: new Date('2024-01-16T00:30:00+09:00'),
        startTime: '23:00',
        endTime: '01:00',
        dayOfWeeks: '1',
        expected: true,
      },
      {
        currentTime: new Date('2024-01-15T22:58:00+09:00'),
        startTime: '23:00',
        endTime: '01:00',
        dayOfWeeks: '1',
        expected: false,
      },
      {
        currentTime: new Date('2024-01-16T01:01:00+09:00'),
        startTime: '23:00',
        endTime: '01:00',
        dayOfWeeks: '1',
        expected: false,
      },
    ];

    for (const testCase of testCases) {
      it(`${testCase.currentTime.toLocaleTimeString()} ${testCase.startTime} ~ ${testCase.endTime}`, async () => {
        jest.setSystemTime(testCase.currentTime);
        const condition = {
          type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE,
          dayOfWeeks: testCase.dayOfWeeks,
          startTime: testCase.startTime,
          endTime: testCase.endTime,
        } as unknown as RecipeCondition;

        const context = new ValidationContext(condition);
        const result = await validator.validate(context);
        expect(result).toBe(testCase.expected);
      });
    }
  });
});
