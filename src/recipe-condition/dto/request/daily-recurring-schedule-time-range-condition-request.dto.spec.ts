import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { DailyRecurringScheduleTimeRangeConditionRequestDto } from './daily-recurring-schedule-time-range-condition-request.dto';
import { RecipeConditionType } from '../../entities/recipe-condition.entity';

describe('DailyRecurringScheduleTimeRangeConditionRequestDto', () => {
  const createAndValidateDto = async (dto: any) => {
    const dtoInstance = plainToInstance(
      DailyRecurringScheduleTimeRangeConditionRequestDto,
      dto,
    );
    return await validate(dtoInstance);
  };

  describe('시작 시간(startTime) 필드 검증', () => {
    it('유효한 시작 시간 형식(HH:mm:ss)이 주어지면 검증을 통과해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.DAILY_RECURRING_SCHEDULE_TIME_RANGE,
        startTime: '14:30:00',
        endTime: '15:30:00',
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBe(0);
    });

    it('시작 시간이 누락되면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.DAILY_RECURRING_SCHEDULE_TIME_RANGE,
        endTime: '15:30:00',
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('시작 시간 형식이 잘못되면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.DAILY_RECURRING_SCHEDULE_TIME_RANGE,
        startTime: '25:30:00', // 잘못된 시간
        endTime: '15:30:00',
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('matches');
    });

    it('시작 시간 형식이 HH:mm:ss가 아니면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.DAILY_RECURRING_SCHEDULE_TIME_RANGE,
        startTime: '14:30', // 초가 없는 잘못된 형식
        endTime: '15:30:00',
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('matches');
    });
  });

  describe('종료 시간(endTime) 필드 검증', () => {
    it('유효한 종료 시간 형식(HH:mm:ss)이 주어지면 검증을 통과해��� 합니다', async () => {
      const dto = {
        type: RecipeConditionType.DAILY_RECURRING_SCHEDULE_TIME_RANGE,
        startTime: '14:30:00',
        endTime: '15:30:00',
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBe(0);
    });

    it('종료 시간이 누락되면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.DAILY_RECURRING_SCHEDULE_TIME_RANGE,
        startTime: '14:30:00',
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('종료 시간 형식이 잘못되면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.DAILY_RECURRING_SCHEDULE_TIME_RANGE,
        startTime: '14:30:00',
        endTime: '25:30:00', // 잘못된 시간
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('matches');
    });

    it('종료 시간 형식이 HH:mm:ss가 아니면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.DAILY_RECURRING_SCHEDULE_TIME_RANGE,
        startTime: '14:30:00',
        endTime: '15:30', // 초가 없는 잘못된 형식
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('matches');
    });
  });
});
