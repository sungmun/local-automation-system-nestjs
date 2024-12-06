import { BaseRecipeConditionDto } from './base-recipe-condition.dto';
import { RecipeConditionType } from '../entities/recipe-condition.entity';

export class RoomTemperatureConditionDto extends BaseRecipeConditionDto {
  type: RecipeConditionType.ROOM_TEMPERATURE;

  temperature: number;

  unit: '<' | '>' | '=' | '>=' | '<=';

  roomId: number;
}
