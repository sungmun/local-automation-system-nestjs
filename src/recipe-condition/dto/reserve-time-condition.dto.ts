import { IsNotEmpty, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';
import { BaseRecipeConditionDto } from './base-recipe-condition.dto';

export class ReserveTimeConditionDto extends BaseRecipeConditionDto {
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => {
    const date = new Date(value);
    date.setSeconds(0, 0);
    return date;
  })
  reserveTime: Date;
}
