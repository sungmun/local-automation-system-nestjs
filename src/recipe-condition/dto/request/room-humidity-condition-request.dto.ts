import { IsNotEmpty, IsNumber, IsIn } from 'class-validator';
import { BaseRecipeConditionRequestDto } from './base-recipe-condition-request.dto';

export class RoomHumidityConditionRequestDto extends BaseRecipeConditionRequestDto {
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
