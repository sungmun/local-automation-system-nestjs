import { RecipeConditionGroupResponseDto } from '../../../recipe-condition/dto/response/recipe-condition-group-response.dto';
import { DeviceCommandResponseDto } from './device-command-response.dto';
import { RecipeDto } from '../recipe.dto';

export class CreateRecipeResponseDto extends RecipeDto {
  id: number;
  deviceCommands: DeviceCommandResponseDto[];
  recipeGroups: RecipeConditionGroupResponseDto[];
}
