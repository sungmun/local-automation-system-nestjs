import { BaseRecipeConditionDto } from './base-recipe-condition.dto';
import { RecipeConditionType } from '../entities/recipe-condition.entity';
import { ApiProperty } from '@nestjs/swagger';

export class WeeklyRecurringScheduleConditionDto extends BaseRecipeConditionDto {
  @ApiProperty({
    description: '조건 타입',
    enum: RecipeConditionType,
    example: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE,
  })
  type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE;

  @ApiProperty({
    description: '시간',
    example: '10:00',
  })
  time: string;
}
