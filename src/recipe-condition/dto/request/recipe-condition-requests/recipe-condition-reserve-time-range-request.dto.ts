import { IsNotEmpty, IsDate, MinDate } from 'class-validator';
import { Expose } from 'class-transformer';
import { TransformDate } from '../../../../common/decorators/transform-date.decorator';
import { IsDateTimeRange } from '../../../../common/validators';
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
  @IsDateTimeRange('reserveStartTime')
  @TransformDate()
  @Expose({ name: 'endTime' })
  reserveEndTime: Date;
}
