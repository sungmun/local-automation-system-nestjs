import { Type } from 'class-transformer';
import { RecipeDto } from '../recipe.dto';

class SimpleRecipeResponseDto extends RecipeDto {
  id: number;
}
export class RecipeListResponseDto {
  @Type(() => SimpleRecipeResponseDto)
  list: SimpleRecipeResponseDto[];
}
