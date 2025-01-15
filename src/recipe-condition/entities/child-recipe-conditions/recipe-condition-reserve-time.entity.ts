import { ChildEntity, Column } from 'typeorm';
import {
  RecipeCondition,
  RecipeConditionType,
} from '../recipe-condition.entity';

@ChildEntity(RecipeConditionType.RESERVE_TIME)
export class RecipeConditionReserveTime extends RecipeCondition {
  @Column({ nullable: true })
  reserveTime: Date;
}
