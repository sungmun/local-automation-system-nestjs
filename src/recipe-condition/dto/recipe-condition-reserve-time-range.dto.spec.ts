import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RecipeConditionReserveTimeRangeDto } from './recipe-condition-reserve-time-range.dto';
import { RecipeConditionType } from '../entities/recipe-condition.entity';

describe('RecipeConditionReserveTimeRangeDto', () => {
  const createAndValidateDto = async (dto: any) => {
    const dtoInstance = plainToInstance(
      RecipeConditionReserveTimeRangeDto,
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
        reserveStartTime: futureDate.toISOString(),
        reserveEndTime: new Date(futureDate.getTime() + 3600000).toISOString(),
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBe(0);
    });

    it('시작 시간이 누락되면 검증에 실패해야 합니��', async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);

      const dto = {
        type: RecipeConditionType.RESERVE_TIME_RANGE,
        reserveEndTime: futureDate.toISOString(),
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isDate');
    });

    it('시작 시간이 과거이면 검증에 실패해야 합니다', async () => {
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 1);

      const dto = {
        type: RecipeConditionType.RESERVE_TIME_RANGE,
        reserveStartTime: pastDate.toISOString(),
        reserveEndTime: new Date().toISOString(),
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('minDate');
    });
  });

  describe('종료 시간(endTime) 필드 검증', () => {
    it('유효한 종료 시간이 주어지면 검증을 통과해야 합니다', async () => {
      const startDate = new Date();
      startDate.setHours(startDate.getHours() + 1);
      const endDate = new Date(startDate.getTime() + 3600000);

      const dto = {
        type: RecipeConditionType.RESERVE_TIME_RANGE,
        reserveStartTime: startDate.toISOString(),
        reserveEndTime: endDate.toISOString(),
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBe(0);
    });

    it('종료 시간이 누락되면 검증에 실패해야 합니다', async () => {
      const startDate = new Date();
      startDate.setHours(startDate.getHours() + 1);

      const dto = {
        type: RecipeConditionType.RESERVE_TIME_RANGE,
        reserveStartTime: startDate.toISOString(),
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isDate');
    });

    it('종료 시간이 시작 시간보다 이전이면 검증에 실패해야 합니다', async () => {
      const startDate = new Date();
      startDate.setHours(startDate.getHours() + 2);
      const endDate = new Date();
      endDate.setHours(endDate.getHours() + 1);

      const dto = {
        type: RecipeConditionType.RESERVE_TIME_RANGE,
        reserveStartTime: startDate.toISOString(),
        reserveEndTime: endDate.toISOString(),
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isDateTimeRangeValid');
    });
  });

  describe('DTO 변환 검증', () => {
    it('문자열로 된 시간이 Date 객체로 변환되어야 합니다 (이때 ms/s 는 0으로 변환되어야 함)', () => {
      const startDate = new Date();
      startDate.setHours(startDate.getHours() + 1);
      const endDate = new Date(startDate.getTime() + 3600000);

      const dto = {
        type: RecipeConditionType.RESERVE_TIME_RANGE,
        reserveStartTime: startDate.toISOString(),
        reserveEndTime: endDate.toISOString(),
      };

      const dtoInstance = plainToInstance(
        RecipeConditionReserveTimeRangeDto,
        dto,
      );

      expect(dtoInstance.startTime).toBeInstanceOf(Date);
      expect(dtoInstance.endTime).toBeInstanceOf(Date);
      expect(dtoInstance.startTime.getSeconds()).toBe(0);
      expect(dtoInstance.startTime.getMilliseconds()).toBe(0);
      expect(dtoInstance.endTime.getSeconds()).toBe(0);
      expect(dtoInstance.endTime.getMilliseconds()).toBe(0);
    });
  });
});
