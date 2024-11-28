import { IsIn, IsNotEmpty } from 'class-validator';
import { RecipeConditionType } from '../../entities/recipe-condition.entity';

export class BaseRecipeConditionRequestDto {
  @IsIn(Object.values(RecipeConditionType))
  @IsNotEmpty()
  type: RecipeConditionType;
}
