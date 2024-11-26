import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { WeeklyRecurringScheduleTimeRangeConditionDto } from './weekly-recurring-schedule-time-range-condition.dto';
import { RecipeConditionType } from '../entities/recipe-condition.entity';

describe('WeeklyRecurringScheduleTimeRangeConditionDto', () => {
  const createAndValidateDto = async (dto: any) => {
    const dtoInstance = plainToInstance(
      WeeklyRecurringScheduleTimeRangeConditionDto,
      dto,
    );
    return await validate(dtoInstance);
  };

  describe('시작 시간(startTime) 필드 검증', () => {
    it('유효한 시작 시간 형식(HH:mm:ss)이 주어지면 검증을 통과해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE,
        startTime: '14:30:00',
        endTime: '15:30:00',
        dayOfWeeks: [1, 3, 5],
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBe(0);
    });

    it('시작 시간이 누락되면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE,
        endTime: '15:30:00',
        dayOfWeeks: [1, 3, 5],
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('잘못된 시작 시간 형식이면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE,
        startTime: '25:00:00',
        endTime: '15:30:00',
        dayOfWeeks: [1, 3, 5],
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('matches');
    });
  });

  describe('종료 시간(endTime) 필드 검증', () => {
    it('유효한 종료 시간 형식(HH:mm:ss)이 주어지면 검증을 통과해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE,
        startTime: '14:30:00',
        endTime: '15:30:00',
        dayOfWeeks: [1, 3, 5],
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBe(0);
    });

    it('종료 시간이 누락되면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE,
        startTime: '14:30:00',
        dayOfWeeks: [1, 3, 5],
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('잘못된 종료 시간 형식이면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE,
        startTime: '14:30:00',
        endTime: '25:00:00',
        dayOfWeeks: [1, 3, 5],
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('matches');
    });
  });

  describe('요일(dayOfWeeks) 필드 검증', () => {
    it('유효한 요일 배열이 주어지면 검증을 통과하고 문자열로 변환되어야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE,
        startTime: '14:30:00',
        endTime: '15:30:00',
        dayOfWeeks: [1, 3, 5],
      };

      const dtoInstance = plainToInstance(
        WeeklyRecurringScheduleTimeRangeConditionDto,
        dto,
      );
      const errors = await validate(dtoInstance);

      expect(errors.length).toBe(0);
      expect(dtoInstance.dayOfWeeks).toBe('1,3,5');
    });

    it('중복된 요일이 제거되어야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE,
        startTime: '14:30:00',
        endTime: '15:30:00',
        dayOfWeeks: [1, 1, 3, 3, 5],
      };

      const dtoInstance = plainToInstance(
        WeeklyRecurringScheduleTimeRangeConditionDto,
        dto,
      );
      const errors = await validate(dtoInstance);

      expect(errors.length).toBe(0);
      expect(dtoInstance.dayOfWeeks).toBe('1,3,5');
    });

    it('요일이 0-6 범위를 벗어나면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE,
        startTime: '14:30:00',
        endTime: '15:30:00',
        dayOfWeeks: [1, 7, 8],
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('max');
    });

    it('요일 배열이 비어있으면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE,
        startTime: '14:30:00',
        endTime: '15:30:00',
        dayOfWeeks: [],
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('arrayMinSize');
    });

    it('요일 배열이 7개를 초과하면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE,
        startTime: '14:30:00',
        endTime: '15:30:00',
        dayOfWeeks: [0, 1, 2, 3, 4, 5, 6, 0],
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('arrayMaxSize');
    });
  });
});
