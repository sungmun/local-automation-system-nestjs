import { BaseRecipeConditionDto } from './base-recipe-condition.dto';
import { RecipeConditionType } from '../entities/recipe-condition.entity';

export class RecipeConditionReserveTimeRangeDto extends BaseRecipeConditionDto {
  type: RecipeConditionType.RESERVE_TIME_RANGE;

  reserveStartTime: Date;

  reserveEndTime: Date;
}
