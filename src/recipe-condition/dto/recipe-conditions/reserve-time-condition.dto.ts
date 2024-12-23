import { BaseRecipeConditionDto } from '../base-recipe-condition.dto';
import { RecipeConditionType } from '../../entities/recipe-condition.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ReserveTimeConditionDto extends BaseRecipeConditionDto {
  @ApiProperty({
    description: '조건 타입',
    enum: RecipeConditionType,
    example: RecipeConditionType.RESERVE_TIME,
  })
  type: RecipeConditionType.RESERVE_TIME;

  @ApiProperty({
    description: '예약 시간',
    example: '2024-01-01T18:00:00Z',
    type: Date,
  })
  reserveTime: Date;
}
