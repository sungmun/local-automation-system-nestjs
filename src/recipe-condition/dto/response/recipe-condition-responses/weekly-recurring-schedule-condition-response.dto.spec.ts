import { WeeklyRecurringScheduleConditionResponseDto } from './weekly-recurring-schedule-condition-response.dto';
import { RecipeConditionType } from '../../../entities/recipe-condition.entity';
import { plainToInstance } from 'class-transformer';

describe('WeeklyRecurringScheduleConditionResponseDto', () => {
  describe('생성자 테스트', () => {
    it('모든 필수 속성이 정상적으로 설정되어야 합니다', () => {
      const dto = plainToInstance(WeeklyRecurringScheduleConditionResponseDto, {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE,
        time: '15:00:00',
        dayOfWeeks: '1,3,5',
      });

      expect(dto.type).toBe(RecipeConditionType.WEEKLY_RECURRING_SCHEDULE);
      expect(dto.time).toBe('15:00:00');
      expect(dto.dayOfWeeks).toEqual([1, 3, 5]);
    });
  });
});
