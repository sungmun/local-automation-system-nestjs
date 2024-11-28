import { BaseRecipeConditionDto } from './base-recipe-condition.dto';
import { RecipeConditionType } from '../entities/recipe-condition.entity';

export class WeeklyRecurringScheduleConditionDto extends BaseRecipeConditionDto {
  type: RecipeConditionType.WEEKLY_RECURRING_SCHEDULE;

  time: string;
}
