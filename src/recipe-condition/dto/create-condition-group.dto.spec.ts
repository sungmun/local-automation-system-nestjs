import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateRecipeConditionGroupDto } from './create-condition-group.dto';
import { RecipeConditionType } from '../entities/recipe-condition.entity';

describe('CreateRecipeConditionGroupDto', () => {
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

      const dtoInstance = plainToInstance(CreateRecipeConditionGroupDto, dto);
      const errors = await validate(dtoInstance);
      expect(errors.length).toBe(0);
    });

    it('습도 조건을 포함한 그룹이 유효해야 합니다', async () => {
      const dto = {
        operator: 'AND',
        conditions: [
          {
            type: RecipeConditionType.ROOM_HUMIDITY,
            humidity: 60,
            unit: '<',
            roomId: 1,
          },
        ],
      };

      const dtoInstance = plainToInstance(CreateRecipeConditionGroupDto, dto);
      const errors = await validate(dtoInstance);
      expect(errors.length).toBe(0);
    });

    it('예약 시간 조건을 포함한 그룹이 유효해야 합니다', async () => {
      const dto = {
        operator: 'AND',
        conditions: [
          {
            type: RecipeConditionType.RESERVE_TIME,
            reserveTime: new Date().toISOString(),
          },
        ],
      };

      const dtoInstance = plainToInstance(CreateRecipeConditionGroupDto, dto);
      const errors = await validate(dtoInstance);
      expect(errors.length).toBe(0);
    });

    it('여러 타입의 조건을 포함한 그룹이 유효해야 합니다', async () => {
      const dto = {
        operator: 'AND',
        conditions: [
          {
            type: RecipeConditionType.ROOM_TEMPERATURE,
            temperature: 25,
            unit: '>',
            roomId: 1,
          },
          {
            type: RecipeConditionType.ROOM_HUMIDITY,
            humidity: 60,
            unit: '<',
            roomId: 1,
          },
          {
            type: RecipeConditionType.RESERVE_TIME,
            reserveTime: new Date().toISOString(),
          },
        ],
      };

      const dtoInstance = plainToInstance(CreateRecipeConditionGroupDto, dto);
      const errors = await validate(dtoInstance);
      expect(errors.length).toBe(0);
    });

    it('지원하지 않는 타입의 조건이 있으면 검증에 실패해야 합니다', async () => {
      const dto = {
        operator: 'AND',
        conditions: [
          {
            type: 'UNSUPPORTED_TYPE',
            someValue: 123,
          },
        ],
      };

      const dtoInstance = plainToInstance(CreateRecipeConditionGroupDto, dto);
      const errors = await validate(dtoInstance);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('필수 필드가 누락된 조건이 있으면 검증에 실패해야 합니다', async () => {
      const dto = {
        operator: 'AND',
        conditions: [
          {
            type: RecipeConditionType.ROOM_TEMPERATURE,
            // temperature와 unit이 누락됨
            roomId: 1,
          },
        ],
      };

      const dtoInstance = plainToInstance(CreateRecipeConditionGroupDto, dto);
      const errors = await validate(dtoInstance);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('operator 검증', () => {
    it('operator가 AND일 때 유효성 검사를 통과해야 합니다', async () => {
      const dto = {
        operator: 'AND',
        conditions: [],
      };

      const dtoInstance = plainToInstance(CreateRecipeConditionGroupDto, dto);
      const errors = await validate(dtoInstance);
      expect(errors.length).toBe(0);
    });

    it('operator가 OR일 때 유효성 검사를 통과해야 합니다', async () => {
      const dto = {
        operator: 'OR',
        conditions: [],
      };

      const dtoInstance = plainToInstance(CreateRecipeConditionGroupDto, dto);
      const errors = await validate(dtoInstance);
      expect(errors.length).toBe(0);
    });

    it('operator가 소문자일 때 유효성 검사에 실패해야 합니다', async () => {
      const dto = {
        operator: 'and',
        conditions: [],
      };

      const dtoInstance = plainToInstance(CreateRecipeConditionGroupDto, dto);
      const errors = await validate(dtoInstance);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isIn');
    });

    it('operator가 null일 때 유효성 검사에 실패해야 합니다', async () => {
      const dto = {
        operator: null,
        conditions: [],
      };

      const dtoInstance = plainToInstance(CreateRecipeConditionGroupDto, dto);
      const errors = await validate(dtoInstance);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('operator가 undefined일 때 유효성 검사에 실패해야 합니다', async () => {
      const dto = {
        conditions: [],
      };

      const dtoInstance = plainToInstance(CreateRecipeConditionGroupDto, dto);
      const errors = await validate(dtoInstance);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });
});
