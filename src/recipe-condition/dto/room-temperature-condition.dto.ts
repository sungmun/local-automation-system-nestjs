import { BaseRecipeConditionDto } from './base-recipe-condition.dto';
import { RecipeConditionType } from '../entities/recipe-condition.entity';
import { ApiProperty } from '@nestjs/swagger';

export class RoomTemperatureConditionDto extends BaseRecipeConditionDto {
  @ApiProperty({
    description: '조건 타입',
    enum: RecipeConditionType,
    example: RecipeConditionType.ROOM_TEMPERATURE,
  })
  type: RecipeConditionType.ROOM_TEMPERATURE;

  @ApiProperty({
    description: '온도',
    example: 25,
  })
  temperature: number;

  @ApiProperty({
    description: '온도 비교 연산자',
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
