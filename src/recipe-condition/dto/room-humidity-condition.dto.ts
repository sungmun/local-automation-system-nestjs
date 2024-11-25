import { IsNotEmpty, IsNumber, IsIn } from 'class-validator';
import { BaseRecipeConditionDto } from './base-recipe-condition.dto';

export class RoomHumidityConditionDto extends BaseRecipeConditionDto {
  @IsNotEmpty()
  @IsNumber()
  humidity: number;

  @IsIn(['<', '>', '=', '>=', '<='])
  @IsNotEmpty()
  unit: '<' | '>' | '=' | '>=' | '<=';

  @IsNotEmpty()
  @IsNumber()
  roomId: number;
}
