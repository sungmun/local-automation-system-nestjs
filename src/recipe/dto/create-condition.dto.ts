import { IsNotEmpty, Allow, IsIn, IsNumber, ValidateIf } from 'class-validator';
import { RecipeConditionType } from '../entities/recipe-condition.entity';
import { Transform } from 'class-transformer';

export class CreateRecipeConditionDto {
  @IsIn(['ROOM_TEMPERATURE', 'ROOM_HUMIDITY'])
  @IsNotEmpty()
  type: RecipeConditionType;

  @ValidateIf(
    (object) =>
      object.type === 'ROOM_TEMPERATURE' && object.temperature !== undefined,
  )
  @Transform(({ value }) => value * 100)
  temperature: number;

  @ValidateIf(
    (object) =>
      object.type === 'ROOM_HUMIDITY' && object.humidity !== undefined,
  )
  @IsNumber()
  humidity: number;

  @IsIn(['<', '>', '=', '>=', '<='])
  unit: '<' | '>' | '=' | '>=' | '<=';

  @IsNumber()
  roomId: number;
}
