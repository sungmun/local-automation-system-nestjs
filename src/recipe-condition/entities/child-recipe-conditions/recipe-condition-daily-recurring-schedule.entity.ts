import { ChildEntity, Column } from 'typeorm';
import {
  RecipeCondition,
  RecipeConditionType,
} from '../recipe-condition.entity';

@ChildEntity(RecipeConditionType.DAILY_RECURRING_SCHEDULE)
export class RecipeConditionDailyRecurringSchedule extends RecipeCondition {
  @Column()
  time: string;
}
