import { ApiProperty } from '@nestjs/swagger';
import { RecipeConditionType } from '../entities/recipe-condition.entity';

export class BaseRecipeConditionDto {
  @ApiProperty({
    enum: RecipeConditionType,
    description: '레시피 조건의 타입',
    example: RecipeConditionType.ROOM_TEMPERATURE,
  })
  type: RecipeConditionType;
}
