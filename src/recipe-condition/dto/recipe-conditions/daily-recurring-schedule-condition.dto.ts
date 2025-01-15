import { BaseRecipeConditionDto } from '../base-recipe-condition.dto';
import { RecipeConditionType } from '../../entities/recipe-condition.entity';
import { ApiProperty } from '@nestjs/swagger';

export class DailyRecurringScheduleConditionDto extends BaseRecipeConditionDto {
  @ApiProperty({
    description: '조건 타입',
    enum: RecipeConditionType,
    example: RecipeConditionType.DAILY_RECURRING_SCHEDULE,
  })
  type: RecipeConditionType.DAILY_RECURRING_SCHEDULE;

  @ApiProperty({
    description: '시간',
    example: '10:00',
  })
  time: string;
}
