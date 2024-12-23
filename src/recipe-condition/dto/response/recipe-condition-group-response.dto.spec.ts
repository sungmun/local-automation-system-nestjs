import { RecipeConditionGroupResponseDto } from './recipe-condition-group-response.dto';
import { RecipeConditionType } from '../../entities/recipe-condition.entity';
import { plainToInstance } from 'class-transformer';
import { RoomTemperatureConditionResponseDto } from './recipe-condition-responses/room-temperature-condition-response.dto';

describe('RecipeConditionGroupResponseDto', () => {
  describe('생성자 테스트', () => {
    it('모든 필수 속성이 정상적으로 설정되어야 합니다', () => {
      const dto = plainToInstance(RecipeConditionGroupResponseDto, {
        operator: 'AND',
        conditions: [],
      });

      expect(dto.operator).toBe('AND');
      expect(dto.conditions).toEqual([]);
    });

    it('conditions 배열에 다른 조건들을 추가할 수 있어야 합니다', () => {
      const childCondition = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
        temperature: 25,
      };

      const dto = plainToInstance(RecipeConditionGroupResponseDto, {
        operator: 'AND',
        conditions: [
          {
            type: RecipeConditionType.ROOM_TEMPERATURE,
            temperature: 25,
          },
        ],
      });

      expect(dto.conditions).toHaveLength(1);
      expect(dto.conditions[0]).toEqual(
        plainToInstance(RoomTemperatureConditionResponseDto, childCondition),
      );
    });
  });
});
