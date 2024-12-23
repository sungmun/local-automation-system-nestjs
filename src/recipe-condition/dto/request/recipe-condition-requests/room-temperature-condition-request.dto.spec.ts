import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RoomTemperatureConditionRequestDto } from './room-temperature-condition-request.dto';
import { RecipeConditionType } from '../../../entities/recipe-condition.entity';

describe('RoomTemperatureConditionRequestDto', () => {
  const createAndValidateDto = async (dto: any) => {
    const dtoInstance = plainToInstance(
      RoomTemperatureConditionRequestDto,
      dto,
    );
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
  });

  describe('단위(unit) 필드 검증', () => {
    it('유효한 단위가 주어지면 검증을 통과해야 합니다', async () => {
      const validUnits = ['<', '>', '=', '>=', '<='];

      for (const unit of validUnits) {
        const dto = {
          type: RecipeConditionType.ROOM_TEMPERATURE,
          temperature: 25,
          unit,
          roomId: 1,
        };

        const errors = await createAndValidateDto(dto);
        expect(errors.length).toBe(0);
      }
    });

    it('유효하지 않은 단위가 주어지면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
        temperature: 25,
        unit: '!=',
        roomId: 1,
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isIn');
    });
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
        roomId: '1번방',
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });
  });
});
