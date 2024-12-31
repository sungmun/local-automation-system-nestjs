import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateRecipeConditionGroupRequestDto } from './create-condition-group-request.dto';
import { RecipeConditionType } from '../../entities/recipe-condition.entity';

describe('CreateRecipeConditionGroupRequestDto', () => {
  describe('유효성 검사', () => {
    it('온도 조건을 포함한 그룹이 유효해야 합니다', async () => {
      const dto = {
        operator: 'AND',
        conditions: [
          {
            type: 'ROOM_TEMPERATURE',
            temperature: 25,
            unit: '>',
            roomId: 1,
          },
        ],
      };

      const dtoInstance = plainToInstance(
        CreateRecipeConditionGroupRequestDto,
        dto,
      );
      const errors = await validate(dtoInstance);
      expect(errors.length).toBe(0);
    });

    it('습도 조건을 포함한 그룹이 유효해야 합니다', async () => {
      const dto = {
        operator: 'AND',
        conditions: [
          {
            type: 'ROOM_HUMIDITY',
            humidity: 60,
            unit: '>',
            roomId: 1,
          },
        ],
      };

      const dtoInstance = plainToInstance(
        CreateRecipeConditionGroupRequestDto,
        dto,
      );
      const errors = await validate(dtoInstance);
      expect(errors.length).toBe(0);
    });

    it('예약 시간 조건을 포함한 그룹이 유효해야 합니다', async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);

      const dto = {
        operator: 'AND',
        conditions: [
          {
            type: 'RESERVE_TIME',
            reserveTime: futureDate.toISOString(),
          },
        ],
      };

      const dtoInstance = plainToInstance(
        CreateRecipeConditionGroupRequestDto,
        dto,
      );
      const errors = await validate(dtoInstance);
      expect(errors.length).toBe(0);
    });

    it('operator가 누락되면 검증에 실패해야 합니다', async () => {
      const dto = {
        conditions: [
          {
            type: 'ROOM_TEMPERATURE',
            temperature: 25,
            unit: '>',
            roomId: 1,
          },
        ],
      };

      const dtoInstance = plainToInstance(
        CreateRecipeConditionGroupRequestDto,
        dto,
      );
      const errors = await validate(dtoInstance);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    describe('STATUS_DELAY_MAINTAIN 조건 검증', () => {
      it('STATUS_DELAY_MAINTAIN 조건이 없어도 유효해야 합니다', async () => {
        const dto = {
          operator: 'AND',
          conditions: [],
        };

        const dtoInstance = plainToInstance(
          CreateRecipeConditionGroupRequestDto,
          dto,
        );
        const errors = await validate(dtoInstance);
        expect(errors.length).toBe(0);
      });

      it('STATUS_DELAY_MAINTAIN 조건이 하나만 있으면 유효해야 합니다', async () => {
        const dto = {
          operator: 'AND',
          conditions: [
            {
              type: RecipeConditionType.STATUS_DELAY_MAINTAIN,
              delayTime: 60,
            },
          ],
        };

        const dtoInstance = plainToInstance(
          CreateRecipeConditionGroupRequestDto,
          dto,
        );
        const errors = await validate(dtoInstance);
        expect(errors.length).toBe(0);
      });

      it('STATUS_DELAY_MAINTAIN 조건이 두 개 이상이면 검증에 실패해야 합니다', async () => {
        const dto = {
          operator: 'AND',
          conditions: [
            {
              type: RecipeConditionType.STATUS_DELAY_MAINTAIN,
              delayTime: 60,
            },
            {
              type: RecipeConditionType.STATUS_DELAY_MAINTAIN,
              delayTime: 120,
            },
          ],
        };

        const dtoInstance = plainToInstance(
          CreateRecipeConditionGroupRequestDto,
          dto,
        );
        const errors = await validate(dtoInstance);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('isArrayUniqTypeValid');
      });

      it('STATUS_DELAY_MAINTAIN 조건과 다른 조건을 함께 사용할 수 있어야 합니다', async () => {
        const dto = {
          operator: 'AND',
          conditions: [
            {
              type: RecipeConditionType.STATUS_DELAY_MAINTAIN,
              delayTime: 60,
            },
            {
              type: RecipeConditionType.ROOM_TEMPERATURE,
              temperature: 25,
              unit: '>',
              roomId: 1,
            },
          ],
        };

        const dtoInstance = plainToInstance(
          CreateRecipeConditionGroupRequestDto,
          dto,
        );
        const errors = await validate(dtoInstance);
        expect(errors.length).toBe(0);
      });
    });
  });
});
