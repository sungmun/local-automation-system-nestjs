import { IsNotEmpty, IsIn, IsNumber, ValidateIf } from 'class-validator';
import { RecipeConditionType } from '../../recipe-condition/entities/recipe-condition.entity';
import { Transform } from 'class-transformer';

export class CreateRecipeConditionDto {
  @IsIn(Object.values(RecipeConditionType))
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
