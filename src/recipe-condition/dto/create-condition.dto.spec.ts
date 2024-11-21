import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateRecipeConditionDto } from './create-condition.dto';
import { RecipeConditionType } from '../entities/recipe-condition.entity';

describe('CreateRecipeConditionDto', () => {
  describe('온도 조건 검증', () => {
    it('유효한 온도 조건을 검증해야 합니다', async () => {
      const condition = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
        temperature: 25,
        unit: '>',
        roomId: 1,
      };

      const errors = await validate(
        plainToInstance(CreateRecipeConditionDto, condition),
      );
      expect(errors.length).toBe(0);
    });

    it('온도값이 transform 되어야 합니다', async () => {
      const condition = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
        temperature: 25,
        unit: '>',
        roomId: 1,
      };

      const instance = plainToInstance(CreateRecipeConditionDto, condition);
      expect(instance.temperature).toBe(2500);
    });

    it('온도값이 숫자가 아니면 검증에 실패해야 합니다', async () => {
      const condition = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
        temperature: '25도' as any,
        unit: '>',
        roomId: 1,
      };

      const errors = await validate(
        plainToInstance(CreateRecipeConditionDto, condition),
      );
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });
  });

  describe('습도 조건 검증', () => {
    it('유효한 습도 조건을 검증해야 합니다', async () => {
      const condition = {
        type: RecipeConditionType.ROOM_HUMIDITY,
        humidity: 60,
        unit: '<',
        roomId: 1,
      };

      const errors = await validate(
        plainToInstance(CreateRecipeConditionDto, condition),
      );
      expect(errors.length).toBe(0);
    });

    it('습도값이 숫자가 아니면 검증에 실패해야 합니다', async () => {
      const condition = {
        type: RecipeConditionType.ROOM_HUMIDITY,
        humidity: '60%' as any,
        unit: '<',
        roomId: 1,
      };

      const errors = await validate(
        plainToInstance(CreateRecipeConditionDto, condition),
      );
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });
  });

  describe('예약 시간 조건 검증', () => {
    it('유효한 예약 시간 조건을 검증해야 합니다', async () => {
      const condition = {
        type: RecipeConditionType.RESERVE_TIME,
        reserveTime: new Date().toISOString(),
      };

      const errors = await validate(
        plainToInstance(CreateRecipeConditionDto, condition),
      );
      console.log(errors);
      expect(errors.length).toBe(0);
    });

    it('예약 시간이 유효한 날짜가 아니면 검증에 실패해야 합니다', async () => {
      const condition = {
        type: RecipeConditionType.RESERVE_TIME,
        reserveTime: 'invalid-date',
      };

      const errors = await validate(
        plainToInstance(CreateRecipeConditionDto, condition),
      );
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isDate');
    });
  });

  describe('공통 필드 검증', () => {
    it('type이 유효하지 않으면 검증에 실패해야 합니다', async () => {
      const condition = {
        type: 'INVALID_TYPE',
        temperature: 25,
        unit: '>',
        roomId: 1,
      };

      const errors = await validate(
        plainToInstance(CreateRecipeConditionDto, condition),
      );
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isIn');
    });

    it('unit이 유효하지 않으면 검증에 실패해야 합니다', async () => {
      const condition = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
        temperature: 25,
        unit: 'INVALID_UNIT',
        roomId: 1,
      };

      const errors = await validate(
        plainToInstance(CreateRecipeConditionDto, condition),
      );
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isIn');
    });

    it('roomId가 필요한 타입에서 roomId가 없으면 검증에 실패해야 합니다', async () => {
      const condition = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
        temperature: 25,
        unit: '>',
      };

      const errors = await validate(
        plainToInstance(CreateRecipeConditionDto, condition),
      );
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });

    it('roomId가 숫자가 아니면 검증에 실패해야 합니다', async () => {
      const condition = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
        temperature: 25,
        unit: '>',
        roomId: '1' as any,
      };

      const errors = await validate(
        plainToInstance(CreateRecipeConditionDto, condition),
      );
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });
  });
});
