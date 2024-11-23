import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ReserveTimeConditionDto } from './reserve-time-condition.dto';
import { RecipeConditionType } from '../entities/recipe-condition.entity';

describe('ReserveTimeConditionDto', () => {
  const createAndValidateDto = async (dto: any) => {
    const dtoInstance = plainToInstance(ReserveTimeConditionDto, dto);
    return await validate(dtoInstance);
  };

  describe('예약 시간(reserveTime) 필드 검증', () => {
    it('유효한 예약 시간이 주어지면 검증을 통과해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.RESERVE_TIME,
        reserveTime: new Date().toISOString(),
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBe(0);
    });

    it('예약 시간이 누락되면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.RESERVE_TIME,
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('예약 시간이 유효하지 않은 형식이면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.RESERVE_TIME,
        reserveTime: 'invalid-date',
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);

      expect(errors[0].constraints).toHaveProperty('isDate');
    });
  });

  describe('DTO 변환 검증', () => {
    it('문자열로 된 예약 시간이 Date 객체로 변환되어야 합니다. (이때 ms/s 는 0으로 변환되어야 함)', () => {
      const isoString = new Date().toISOString();
      const dto = {
        type: RecipeConditionType.RESERVE_TIME,
        reserveTime: isoString,
      };
      const transformDate = new Date(isoString);
      transformDate.setSeconds(0, 0);
      const dtoInstance = plainToInstance(ReserveTimeConditionDto, dto);
      expect(dtoInstance.reserveTime).toBeInstanceOf(Date);
      expect(dtoInstance.reserveTime.toISOString()).toBe(
        transformDate.toISOString(),
      );
    });
  });
});
