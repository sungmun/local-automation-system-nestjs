import { BaseRecipeConditionDto } from './base-recipe-condition.dto';
import { RecipeConditionType } from '../entities/recipe-condition.entity';

export class WeeklyRecurringScheduleTimeRangeConditionDto extends BaseRecipeConditionDto {
  type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE;

  startTime: string;

  endTime: string;
}
