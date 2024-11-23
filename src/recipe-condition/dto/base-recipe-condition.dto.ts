import { IsIn, IsNotEmpty } from 'class-validator';
import { RecipeConditionType } from '../entities/recipe-condition.entity';

export class BaseRecipeConditionDto {
  @IsIn(Object.values(RecipeConditionType))
  @IsNotEmpty()
  type: RecipeConditionType;
}
