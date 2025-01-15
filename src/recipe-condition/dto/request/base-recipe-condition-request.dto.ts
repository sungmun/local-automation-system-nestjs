import { IsIn, IsNotEmpty } from 'class-validator';
import { RecipeConditionType } from '../../entities/recipe-condition.entity';
import { ApiProperty } from '@nestjs/swagger';

export class BaseRecipeConditionRequestDto {
  @ApiProperty({
    description: '조건 타입',
    enum: RecipeConditionType,
    example: RecipeConditionType.ROOM_TEMPERATURE,
  })
  @IsIn(Object.values(RecipeConditionType))
  @IsNotEmpty()
  type: RecipeConditionType;
}
