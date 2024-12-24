import { DailyRecurringScheduleTimeRangeConditionResponseDto } from './daily-recurring-schedule-time-range-condition-response.dto';
import { RecipeConditionType } from '../../../entities/recipe-condition.entity';
import { plainToInstance } from 'class-transformer';

describe('DailyRecurringScheduleTimeRangeConditionResponseDto', () => {
  describe('생성자 테스트', () => {
    it('모든 필수 속성이 정상적으로 설정되어야 합니다', () => {
      const dto = plainToInstance(
        DailyRecurringScheduleTimeRangeConditionResponseDto,
        {
          type: RecipeConditionType.DAILY_RECURRING_SCHEDULE_TIME_RANGE,
          startTime: '09:00:00',
          endTime: '18:00:00',
        },
      );

      expect(dto.type).toBe(
        RecipeConditionType.DAILY_RECURRING_SCHEDULE_TIME_RANGE,
      );
      expect(dto.startTime).toBe('09:00:00');
      expect(dto.endTime).toBe('18:00:00');
    });

    it('시간 형식이 HH:mm:ss 형식이어야 합니다', () => {
      const dto = plainToInstance(
        DailyRecurringScheduleTimeRangeConditionResponseDto,
        {
          type: RecipeConditionType.DAILY_RECURRING_SCHEDULE_TIME_RANGE,
          startTime: '09:30:00',
          endTime: '18:30:00',
        },
      );

      expect(dto.startTime).toMatch(
        /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
      );
      expect(dto.endTime).toMatch(
        /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
      );
    });

    it('id가 있는 경우 정상적으로 설정되어야 합니다', () => {
      const dto = plainToInstance(
        DailyRecurringScheduleTimeRangeConditionResponseDto,
        {
          id: 1,
          type: RecipeConditionType.DAILY_RECURRING_SCHEDULE_TIME_RANGE,
          startTime: '09:00:00',
          endTime: '18:00:00',
        },
      );

      expect(dto.id).toBe(1);
    });
  });
});
