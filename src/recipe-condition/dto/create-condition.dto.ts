import {
  IsNotEmpty,
  IsIn,
  IsNumber,
  ValidateIf,
  IsDate,
} from 'class-validator';
import { RecipeConditionType } from '../../recipe-condition/entities/recipe-condition.entity';
import { Transform } from 'class-transformer';

export class CreateRecipeConditionDto {
  @IsIn(Object.values(RecipeConditionType))
  @IsNotEmpty()
  type: RecipeConditionType;

  @ValidateIf((object) => object.type === 'ROOM_TEMPERATURE')
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => value * 100)
  temperature: number;

  @ValidateIf((object) => object.type === 'ROOM_HUMIDITY')
  @IsNotEmpty()
  @IsNumber()
  humidity: number;

  @ValidateIf((object) =>
    ['ROOM_HUMIDITY', 'ROOM_TEMPERATURE'].includes(object.type),
  )
  @IsIn(['<', '>', '=', '>=', '<='])
  unit: '<' | '>' | '=' | '>=' | '<=';

  @ValidateIf((object) =>
    ['ROOM_HUMIDITY', 'ROOM_TEMPERATURE'].includes(object.type),
  )
  @IsNotEmpty()
  @IsNumber()
  roomId: number;

  @ValidateIf((object) => object.type === 'RESERVE_TIME')
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => {
    const date = new Date(value);
    date.setSeconds(0, 0);
    return date;
  })
  reserveTime: Date;
}
