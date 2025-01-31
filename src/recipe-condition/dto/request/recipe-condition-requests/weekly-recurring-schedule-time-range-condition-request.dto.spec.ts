import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { WeeklyRecurringScheduleTimeRangeConditionRequestDto } from './weekly-recurring-schedule-time-range-condition-request.dto';
import { RecipeConditionType } from '../../../entities/recipe-condition.entity';

describe('WeeklyRecurringScheduleTimeRangeConditionRequestDto', () => {
  const createAndValidateDto = async (dto: any) => {
    const dtoInstance = plainToInstance(
      WeeklyRecurringScheduleTimeRangeConditionRequestDto,
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

    it('시작 시간 형식이 잘못되면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE,
        startTime: '25:30:00', // 잘못된 시간
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
  });

  describe('요일(dayOfWeeks) 필드 검증', () => {
    it('유효한 요일 배열이 주어지면 검증을 통과해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE,
        startTime: '14:30:00',
        endTime: '15:30:00',
        dayOfWeeks: [0, 1, 2, 3, 4, 5, 6],
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBe(0);
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

    it('요일 값이 범위를 벗어나면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE,
        startTime: '14:30:00',
        endTime: '15:30:00',
        dayOfWeeks: [7], // 유효하지 않은 요일 값
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('max');
    });

    it('중복된 요일이 있을 경우 자동으로 제거되어야 합니다', async () => {
      const dto = new WeeklyRecurringScheduleTimeRangeConditionRequestDto();
      dto._dayOfWeeks = [1, 1, 2, 2, 3];

      expect(dto.dayOfWeeks).toBe('1,2,3');
    });
  });
});
