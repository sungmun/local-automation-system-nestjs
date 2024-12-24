import { BaseRecipeConditionDto } from '../base-recipe-condition.dto';
import { RecipeConditionType } from '../../entities/recipe-condition.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ReserveTimeRangeConditionDto extends BaseRecipeConditionDto {
  @ApiProperty({
    description: '조건 타입',
    enum: RecipeConditionType,
    example: RecipeConditionType.RESERVE_TIME_RANGE,
  })
  type: RecipeConditionType.RESERVE_TIME_RANGE;

  @ApiProperty({
    description: '예약 시작 시간',
    example: '2024-01-01T09:00:00Z',
    type: Date,
  })
  reserveStartTime: Date;

  @ApiProperty({
    description: '예약 종료 시간',
    example: '2024-01-01T18:00:00Z',
    type: Date,
  })
  reserveEndTime: Date;
}
