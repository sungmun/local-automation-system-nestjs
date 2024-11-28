import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { WeeklyRecurringScheduleConditionRequestDto } from './weekly-recurring-schedule-condition-request.dto';
import { RecipeConditionType } from '../../entities/recipe-condition.entity';

describe('WeeklyRecurringScheduleConditionRequestDto', () => {
  const createAndValidateDto = async (dto: any) => {
    const dtoInstance = plainToInstance(
      WeeklyRecurringScheduleConditionRequestDto,
      dto,
    );
    return await validate(dtoInstance);
  };

  describe('시간(time) 필드 검증', () => {
    it('유효한 시간 형식(HH:mm:ss)이 주어지면 검증을 통과해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE,
        time: '14:30:00',
        dayOfWeeks: [1, 3, 5],
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBe(0);
    });

    // ... 나머지 테스트 케이스들
  });
});
