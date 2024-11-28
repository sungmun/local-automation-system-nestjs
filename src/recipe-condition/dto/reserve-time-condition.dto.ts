import { BaseRecipeConditionDto } from './base-recipe-condition.dto';
import { RecipeConditionType } from '../entities/recipe-condition.entity';

export class ReserveTimeConditionDto extends BaseRecipeConditionDto {
  type: RecipeConditionType.RESERVE_TIME;

  reserveTime: Date;
}
