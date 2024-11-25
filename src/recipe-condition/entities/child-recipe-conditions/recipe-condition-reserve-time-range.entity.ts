import { ChildEntity, Column } from 'typeorm';
import {
  RecipeCondition,
  RecipeConditionType,
} from '../recipe-condition.entity';

@ChildEntity(RecipeConditionType.RESERVE_TIME_RANGE)
export class RecipeConditionReserveTimeRange extends RecipeCondition {
  @Column({ nullable: true })
  reserveStartTime: Date;

  @Column({ nullable: true })
  reserveEndTime: Date;
}
