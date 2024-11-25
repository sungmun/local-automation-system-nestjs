import { ChildEntity, Column } from 'typeorm';
import {
  RecipeCondition,
  RecipeConditionType,
} from '../recipe-condition.entity';

@ChildEntity(RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE)
export class RecipeConditionWeeklyRecurringScheduleTimeRange extends RecipeCondition {
  @Column()
  dayOfWeeks: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;
}
