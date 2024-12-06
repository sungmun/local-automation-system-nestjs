import { BaseRecipeConditionDto } from './base-recipe-condition.dto';
import { RecipeConditionType } from '../entities/recipe-condition.entity';
import { ApiProperty } from '@nestjs/swagger';

export class WeeklyRecurringScheduleTimeRangeConditionDto extends BaseRecipeConditionDto {
  @ApiProperty({
    description: '조건 타입',
    enum: RecipeConditionType,
    example: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE,
  })
  type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE;

  @ApiProperty({
    description: '시작 시간',
    example: '10:00',
  })
  startTime: string;

  @ApiProperty({
    description: '종료 시간',
    example: '18:00',
  })
  endTime: string;
}
