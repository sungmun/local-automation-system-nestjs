import { BaseRecipeConditionDto } from './base-recipe-condition.dto';
import { RecipeConditionType } from '../entities/recipe-condition.entity';

export class RoomHumidityConditionDto extends BaseRecipeConditionDto {
  type: RecipeConditionType.ROOM_HUMIDITY;

  humidity: number;

  unit: '<' | '>' | '=' | '>=' | '<=';

  roomId: number;
}
