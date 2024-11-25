import { ChildEntity, Column } from 'typeorm';
import {
  RecipeCondition,
  RecipeConditionType,
} from '../recipe-condition.entity';

@ChildEntity(RecipeConditionType.WEEKLY_RECURRING_SCHEDULE)
export class RecipeConditionWeeklyRecurringSchedule extends RecipeCondition {
  @Column()
  dayOfWeeks: string;

  @Column()
  time: string;
}
