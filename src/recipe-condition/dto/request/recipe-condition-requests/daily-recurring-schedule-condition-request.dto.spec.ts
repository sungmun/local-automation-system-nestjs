import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { DailyRecurringScheduleConditionRequestDto } from './daily-recurring-schedule-condition-request.dto';
import { RecipeConditionType } from '../../../entities/recipe-condition.entity';

describe('DailyRecurringScheduleConditionRequestDto', () => {
  const createAndValidateDto = async (dto: any) => {
    const dtoInstance = plainToInstance(
      DailyRecurringScheduleConditionRequestDto,
      dto,
    );
    return await validate(dtoInstance);
  };

  describe('시간(time) 필드 검증', () => {
    it('유효한 시간 형식(HH:mm:ss)이 주어지면 검증을 통과해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.DAILY_RECURRING_SCHEDULE,
        time: '14:30:00',
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBe(0);
    });

    it('시간이 누락되면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.DAILY_RECURRING_SCHEDULE,
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('잘못된 시간 형식이 주어지면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.DAILY_RECURRING_SCHEDULE,
        time: '25:00:00', // 잘못된 시간
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('matches');
    });

    it('시간 형식이 HH:mm:ss가 아니면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.DAILY_RECURRING_SCHEDULE,
        time: '14:30', // 초가 없는 잘못된 형식
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('matches');
    });
  });
});
