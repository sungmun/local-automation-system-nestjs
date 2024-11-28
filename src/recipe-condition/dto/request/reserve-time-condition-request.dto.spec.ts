import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ReserveTimeConditionRequestDto } from './reserve-time-condition-request.dto';
import { RecipeConditionType } from '../../entities/recipe-condition.entity';

describe('ReserveTimeConditionRequestDto', () => {
  const createAndValidateDto = async (dto: any) => {
    const dtoInstance = plainToInstance(ReserveTimeConditionRequestDto, dto);
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

    // ... 나머지 테스트 케이스들
  });
});
