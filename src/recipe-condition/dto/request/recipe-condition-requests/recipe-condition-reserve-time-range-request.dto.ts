import { IsNotEmpty, IsDate, MinDate, Validate } from 'class-validator';
import { Expose } from 'class-transformer';
import { TransformDate } from '../../../../common/decorators/transform-date.decorator';
import { IsDateTimeRangeValid } from '../../../../common/validators/is-time-range-valid.validator';
import { ReserveTimeRangeConditionDto } from '../../recipe-conditions/reserve-time-range-condition.dto';

export class ReserveTimeRangeConditionRequestDto extends ReserveTimeRangeConditionDto {
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