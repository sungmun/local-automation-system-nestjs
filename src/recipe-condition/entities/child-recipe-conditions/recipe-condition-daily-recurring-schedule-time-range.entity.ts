import { ChildEntity, Column } from 'typeorm';
import {
  RecipeCondition,
  RecipeConditionType,
} from '../recipe-condition.entity';

@ChildEntity(RecipeConditionType.DAILY_RECURRING_SCHEDULE_TIME_RANGE)
export class RecipeConditionDailyRecurringScheduleTimeRange extends RecipeCondition {
  @Column()
  startTime: string;

  @Column()
  endTime: string;
}
