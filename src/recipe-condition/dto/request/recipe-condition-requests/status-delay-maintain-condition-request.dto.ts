import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { StatusDelayMaintainConditionDto } from '../../recipe-conditions/status-delay-maintain-condition.dto';

export class StatusDelayMaintainConditionRequestDto extends StatusDelayMaintainConditionDto {
  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  delayTime: number;
}
