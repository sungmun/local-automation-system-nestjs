import { ChildEntity, Column } from 'typeorm';
import {
  RecipeCondition,
  RecipeConditionType,
} from '../recipe-condition.entity';
import { RecipeStatus } from '../../../recipe/entities/recipe.entity';

@ChildEntity(RecipeConditionType.STATUS_DELAY_MAINTAIN)
export class RecipeConditionStatusDelayMaintain extends RecipeCondition {
  @Column()
  delayTime: number;

  @Column({ default: RecipeStatus.STOPPED })
  status: RecipeStatus;

  @Column({ nullable: true })
  startDelayTime: Date | null = null;

  @Column({ default: Number.MAX_VALUE })
  order: number;
}
