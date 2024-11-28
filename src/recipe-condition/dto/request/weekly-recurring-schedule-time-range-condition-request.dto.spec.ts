import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { WeeklyRecurringScheduleTimeRangeConditionRequestDto } from './weekly-recurring-schedule-time-range-condition-request.dto';
import { RecipeConditionType } from '../../entities/recipe-condition.entity';

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

    // ... 나머지 테스트 케이스들
  });
});
