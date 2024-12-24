import { IsNotEmpty, IsDate } from 'class-validator';
import { TransformDate } from '../../../../common/decorators/transform-date.decorator';
import { ReserveTimeConditionDto } from '../../recipe-conditions/reserve-time-condition.dto';

export class ReserveTimeConditionRequestDto extends ReserveTimeConditionDto {
  @IsNotEmpty()
  @IsDate()
  @TransformDate()
  reserveTime: Date;
}
