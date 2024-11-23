import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RoomTemperatureConditionDto } from './room-temperature-condition.dto';
import { RecipeConditionType } from '../entities/recipe-condition.entity';

describe('RoomTemperatureConditionDto', () => {
  const createAndValidateDto = async (dto: any) => {
    const dtoInstance = plainToInstance(RoomTemperatureConditionDto, dto);
    return await validate(dtoInstance);
  };

  describe('온도(temperature) 필드 검증', () => {
    it('유효한 온도값이 주어지면 검증을 통과해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
        temperature: 25,
        unit: '>',
        roomId: 1,
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBe(0);
    });

    it('온도값이 누락되면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
        unit: '>',
        roomId: 1,
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('온도값이 숫자가 아니면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
        temperature: '25도',
        unit: '>',
        roomId: 1,
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });

    it('온도값이 100배로 변환되어야 합니다', () => {
      const dto = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
        temperature: 25,
        unit: '>',
        roomId: 1,
      };

      const dtoInstance = plainToInstance(RoomTemperatureConditionDto, dto);
      expect(dtoInstance.temperature).toBe(2500);
    });
  });

  describe('비교 연산자(unit) 필드 검증', () => {
    it.each([
      ['<', true, '미만 연산자'],
      ['>', true, '초과 연산자'],
      ['=', true, '동등 연산자'],
      ['>=', true, '이상 연산자'],
      ['<=', true, '이하 연산자'],
      ['!=', false, '유효하지 않은 연산자'],
      [null, false, 'null 연산자'],
      [undefined, false, 'undefined 연산자'],
    ])(
      '연산자가 %s일 때 검증 결과는 %s이어야 합니다 (%s)',
      async (unit, isValid) => {
        const dto = {
          type: RecipeConditionType.ROOM_TEMPERATURE,
          temperature: 25,
          unit,
          roomId: 1,
        };

        const errors = await createAndValidateDto(dto);
        expect(errors.length === 0).toBe(isValid);
        if (!isValid) {
          expect(errors[0].constraints).toHaveProperty('isIn');
        }
      },
    );
  });

  describe('방 ID(roomId) 필드 검증', () => {
    it('유효한 방 ID가 주어지면 검증을 통과해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
        temperature: 25,
        unit: '>',
        roomId: 1,
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBe(0);
    });

    it('방 ID가 누락되면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
        temperature: 25,
        unit: '>',
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('방 ID가 숫자가 아니면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
        temperature: 25,
        unit: '>',
        roomId: '1',
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });
  });
});
