import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { BaseRecipeConditionRequestDto } from './base-recipe-condition-request.dto';
import { RecipeConditionType } from '../../entities/recipe-condition.entity';

describe('BaseRecipeConditionRequestDto', () => {
  describe('타입(type) 필드 검증', () => {
    it('유효한 타입이 주어지면 검증을 통과해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
      };

      const dtoInstance = plainToInstance(BaseRecipeConditionRequestDto, dto);
      const errors = await validate(dtoInstance);

      expect(errors.length).toBe(0);
    });

    it('타입이 누락되면 검증에 실패해야 합니다', async () => {
      const dto = {};

      const dtoInstance = plainToInstance(BaseRecipeConditionRequestDto, dto);
      const errors = await validate(dtoInstance);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('유효하지 않은 타입이 주어지면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: 'INVALID_TYPE',
      };

      const dtoInstance = plainToInstance(BaseRecipeConditionRequestDto, dto);
      const errors = await validate(dtoInstance);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isIn');
    });

    it.each([
      [RecipeConditionType.ROOM_TEMPERATURE, true, '온도 조건 타입'],
      [RecipeConditionType.ROOM_HUMIDITY, true, '습도 조건 타입'],
      [RecipeConditionType.RESERVE_TIME, true, '예약 시간 조건 타입'],
      ['INVALID_TYPE', false, '유효하지 않은 타입'],
      [null, false, 'null 타입'],
      [undefined, false, 'undefined 타입'],
    ])(
      '타입이 %s일 때 검증 결과는 %s이어야 합니다 (%s)',
      async (type, isValid) => {
        const dto = { type };

        const dtoInstance = plainToInstance(BaseRecipeConditionRequestDto, dto);
        const errors = await validate(dtoInstance);

        expect(errors.length === 0).toBe(isValid);
        if (!isValid) {
          expect(errors[0].constraints).toBeDefined();
        }
      },
    );
  });
});
