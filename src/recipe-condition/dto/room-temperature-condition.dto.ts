import { IsNotEmpty, IsNumber, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { BaseRecipeConditionDto } from './base-recipe-condition.dto';

export class RoomTemperatureConditionDto extends BaseRecipeConditionDto {
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
