import { BaseRecipeConditionDto } from '../base-recipe-condition.dto';
import { RecipeConditionType } from '../../entities/recipe-condition.entity';
import { ApiProperty } from '@nestjs/swagger';

export class RoomHumidityConditionDto extends BaseRecipeConditionDto {
  @ApiProperty({
    description: '조건 타입',
    enum: RecipeConditionType,
    example: RecipeConditionType.ROOM_HUMIDITY,
  })
  type: RecipeConditionType.ROOM_HUMIDITY;

  @ApiProperty({
    description: '습도',
    example: 60,
  })
  humidity: number;

  @ApiProperty({
    description: '습도 비교 연산자',
    enum: ['<', '>', '=', '>=', '<='],
    example: '<',
  })
  unit: '<' | '>' | '=' | '>=' | '<=';

  @ApiProperty({
    description: '방 아이디',
    example: 1,
  })
  roomId: number;
}
