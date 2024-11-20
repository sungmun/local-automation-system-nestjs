import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateRecipeConditionGroupDto } from './create-condition-group.dto';
import { CreateRecipeConditionDto } from './create-condition.dto';
import { RecipeConditionType } from '../entities/recipe-condition.entity';

describe('CreateRecipeConditionGroupDto', () => {
  describe('유효성 검사', () => {
    it('올바른 데이터로 생성된 DTO는 유효성 검사를 통과해야 합니다', async () => {
      const condition: CreateRecipeConditionDto = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
        temperature: 25,
        unit: '>',
        roomId: 1,
      } as CreateRecipeConditionDto;

      const dto = {
        operator: 'AND',
        conditions: [condition],
      };

      const dtoInstance = plainToInstance(CreateRecipeConditionGroupDto, dto);
      const errors = await validate(dtoInstance);

      expect(errors.length).toBe(0);
    });

    it('operator가 AND 또는 OR가 아닌 경우 유효성 검사에 실패해야 합니다', async () => {
      const dto = {
        operator: 'INVALID',
        conditions: [],
      };

      const dtoInstance = plainToInstance(CreateRecipeConditionGroupDto, dto);
      const errors = await validate(dtoInstance);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isIn');
    });

    it('operator가 비어있는 경우 유효성 검사에 실패해야 합니다', async () => {
      const dto = {
        conditions: [],
      };

      const dtoInstance = plainToInstance(CreateRecipeConditionGroupDto, dto);
      const errors = await validate(dtoInstance);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('conditions가 배열이 아닌 경우 유효성 검사에 실패해야 합니다', async () => {
      const dto = {
        operator: 'AND',
        conditions: 'not-an-array',
      };

      const dtoInstance = plainToInstance(CreateRecipeConditionGroupDto, dto);
      const errors = await validate(dtoInstance);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isArray');
    });

    it('conditions 내부의 조건이 유효하지 않은 경우 유효성 검사에 실패해야 합니다', async () => {
      const invalidCondition = {
        type: 'INVALID_TYPE',
        temperature: 'invalid',
        unit: 'invalid',
      };

      const dto = {
        operator: 'AND',
        conditions: [invalidCondition],
      };

      const dtoInstance = plainToInstance(CreateRecipeConditionGroupDto, dto);
      const errors = await validate(dtoInstance);

      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
