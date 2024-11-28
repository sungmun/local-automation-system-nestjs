import { IsNotEmpty, IsDate, MinDate, Validate } from 'class-validator';
import { Expose } from 'class-transformer';
import { BaseRecipeConditionRequestDto } from './base-recipe-condition-request.dto';
import { TransformDate } from '../../../common/decorators/transform-date.decorator';
import { IsDateTimeRangeValid } from '../../../common/validators/is-time-range-valid.validator';

export class RecipeConditionReserveTimeRangeRequestDto extends BaseRecipeConditionRequestDto {
  @IsNotEmpty()
  @IsDate()
  @MinDate(new Date())
  @TransformDate()
  @Expose({ name: 'startTime' })
  reserveStartTime: Date;

  @IsNotEmpty()
  @IsDate()
  @Validate(IsDateTimeRangeValid, ['reserveStartTime'])
  @TransformDate()
  @Expose({ name: 'endTime' })
  reserveEndTime: Date;
}
