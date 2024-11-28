import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RoomHumidityConditionRequestDto } from './room-humidity-condition-request.dto';
import { RecipeConditionType } from '../../entities/recipe-condition.entity';

describe('RoomHumidityConditionRequestDto', () => {
  const createAndValidateDto = async (dto: any) => {
    const dtoInstance = plainToInstance(RoomHumidityConditionRequestDto, dto);
    return await validate(dtoInstance);
  };

  describe('습도(humidity) 필드 검증', () => {
    it('유효한 습도값이 주어지면 검증을 통과해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.ROOM_HUMIDITY,
        humidity: 60,
        unit: '>',
        roomId: 1,
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBe(0);
    });

    it('습도값이 누락되면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: 'ROOM_HUMIDITY',
        unit: '>',
        roomId: 1,
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('습도값이 숫자가 아니면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: 'ROOM_HUMIDITY',
        humidity: '60%',
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
          type: 'ROOM_HUMIDITY',
          humidity: 60,
          unit,
          roomId: 1,
        };

        const errors = await createAndValidateDto(dto);
        expect(errors.length).toBe(0);
      }
    });

    it('유효하지 않은 단위가 주어지면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: 'ROOM_HUMIDITY',
        humidity: 60,
        unit: '!=',
        roomId: 1,
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isIn');
    });
  });
});
