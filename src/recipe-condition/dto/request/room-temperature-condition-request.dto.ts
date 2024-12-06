import { IsNotEmpty, IsNumber, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { BaseRecipeConditionRequestDto } from './base-recipe-condition-request.dto';

export class RoomTemperatureConditionRequestDto extends BaseRecipeConditionRequestDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => value * 100)
  temperature: number;

  @IsIn(['<', '>', '=', '>=', '<='])
  @IsNotEmpty()
  unit: '<' | '>' | '=' | '>=' | '<=';

  @IsNotEmpty()
  @IsNumber()
  roomId: number;
}
