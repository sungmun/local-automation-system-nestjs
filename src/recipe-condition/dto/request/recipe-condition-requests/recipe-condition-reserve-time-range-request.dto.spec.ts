import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ReserveTimeRangeConditionRequestDto } from './recipe-condition-reserve-time-range-request.dto';
import { RecipeConditionType } from '../../../entities/recipe-condition.entity';

describe('RecipeConditionReserveTimeRangeRequestDto', () => {
  const createAndValidateDto = async (dto: any) => {
    const dtoInstance = plainToInstance(
      ReserveTimeRangeConditionRequestDto,
      dto,
    );
    return await validate(dtoInstance);
  };

  describe('시작 시간(startTime) 필드 검증', () => {
    it('유효한 시작 시간이 주어지면 검증을 통과해야 합니다', async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);

      const dto = {
        type: RecipeConditionType.RESERVE_TIME_RANGE,
        startTime: futureDate.toISOString(),
        endTime: new Date(futureDate.getTime() + 3600000).toISOString(),
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBe(0);
    });

    it('시작 시간이 현재보다 이전이면 검증에 실패해야 합니다', async () => {
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 1);

      const dto = {
        type: 'RESERVE_TIME_RANGE',
        startTime: pastDate.toISOString(),
        endTime: new Date().toISOString(),
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('minDate');
    });
  });

  describe('종료 시간(endTime) 필드 검증', () => {
    it('종료 시간이 시작 시간보다 이전이면 검증에 실패해야 합니다', async () => {
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 2);
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() - 1);

      const dto = {
        type: 'RESERVE_TIME_RANGE',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('IsDateTimeRange');
    });

    it('종료 시간이 누락되면 검증에 실패해야 합니다', async () => {
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 1);

      const dto = {
        type: 'RESERVE_TIME_RANGE',
        startTime: startTime.toISOString(),
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isDate');
    });
  });
});
