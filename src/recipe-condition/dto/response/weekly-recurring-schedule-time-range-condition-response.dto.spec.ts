import { WeeklyRecurringScheduleTimeRangeConditionResponseDto } from './weekly-recurring-schedule-time-range-condition-response.dto';
import { RecipeConditionType } from '../../entities/recipe-condition.entity';
import { plainToInstance } from 'class-transformer';

describe('WeeklyRecurringScheduleTimeRangeConditionResponseDto', () => {
  describe('생성자 테스트', () => {
    it('모든 필수 속성이 정상적으로 설정되어야 합니다', () => {
      const dto = plainToInstance(
        WeeklyRecurringScheduleTimeRangeConditionResponseDto,
        {
          type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE,
          startTime: '09:00:00',
          endTime: '18:00:00',
          dayOfWeeks: '1,2,3',
        },
      );

      expect(dto.type).toBe(
        RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE,
      );
      expect(dto.startTime).toBe('09:00:00');
      expect(dto.endTime).toBe('18:00:00');
      expect(dto.dayOfWeeks).toEqual([1, 2, 3]);
    });
  });
});
