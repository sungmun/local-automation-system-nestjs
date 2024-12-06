import { RoomTemperatureConditionResponseDto } from './room-temperature-condition-response.dto';
import { RecipeConditionType } from '../../entities/recipe-condition.entity';
import { plainToInstance } from 'class-transformer';

describe('RoomTemperatureConditionResponseDto', () => {
  describe('생성자 테스트', () => {
    it('모든 필수 속성이 정상적으로 설정되어야 합니다', () => {
      const dto = plainToInstance(RoomTemperatureConditionResponseDto, {
        type: RecipeConditionType.ROOM_TEMPERATURE,
        temperature: 25,
        unit: '>',
        roomId: 1,
      });

      expect(dto.type).toBe(RecipeConditionType.ROOM_TEMPERATURE);
      expect(dto.temperature).toBe(25);
      expect(dto.unit).toBe('>');
      expect(dto.roomId).toBe(1);
    });

    it('unit이 유효한 값이어야 합니다', () => {
      const validUnits = ['<', '>', '=', '>=', '<='];

      validUnits.forEach((unit) => {
        const dto = plainToInstance(RoomTemperatureConditionResponseDto, {
          type: RecipeConditionType.ROOM_TEMPERATURE,
          temperature: 25,
          unit,
          roomId: 1,
        });

        expect(dto.unit).toBe(unit);
      });
    });

    it('BaseRecipeConditionResponseDto를 상속받아야 합니다', () => {
      const dto = plainToInstance(RoomTemperatureConditionResponseDto, {
        type: RecipeConditionType.ROOM_TEMPERATURE,
        temperature: 25,
        unit: '>',
        roomId: 1,
      });

      expect(dto.type).toBe(RecipeConditionType.ROOM_TEMPERATURE);
    });
  });
});
