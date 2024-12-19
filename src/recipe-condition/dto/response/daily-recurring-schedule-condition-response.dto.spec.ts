import { DailyRecurringScheduleConditionResponseDto } from './daily-recurring-schedule-condition-response.dto';
import { RecipeConditionType } from '../../entities/recipe-condition.entity';
import { plainToInstance } from 'class-transformer';

describe('DailyRecurringScheduleConditionResponseDto', () => {
  describe('생성자 테스트', () => {
    it('모든 필수 속성이 정상적으로 설정되어야 합니다', () => {
      const dto = plainToInstance(DailyRecurringScheduleConditionResponseDto, {
        type: RecipeConditionType.DAILY_RECURRING_SCHEDULE,
        time: '15:00:00',
      });

      expect(dto.type).toBe(RecipeConditionType.DAILY_RECURRING_SCHEDULE);
      expect(dto.time).toBe('15:00:00');
    });

    it('시간 형식이 HH:mm:ss 형식이어야 합니다', () => {
      const dto = plainToInstance(DailyRecurringScheduleConditionResponseDto, {
        type: RecipeConditionType.DAILY_RECURRING_SCHEDULE,
        time: '09:30:00',
      });

      expect(dto.time).toMatch(/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/);
    });

    it('id가 있는 경우 정상적으로 설정되어야 합니다', () => {
      const dto = plainToInstance(DailyRecurringScheduleConditionResponseDto, {
        id: 1,
        type: RecipeConditionType.DAILY_RECURRING_SCHEDULE,
        time: '15:00:00',
      });

      expect(dto.id).toBe(1);
    });
  });
});
