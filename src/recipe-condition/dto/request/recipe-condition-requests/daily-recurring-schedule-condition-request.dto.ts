import { IsNotEmpty, Matches, IsString } from 'class-validator';
import { DailyRecurringScheduleConditionDto } from '../../recipe-conditions/daily-recurring-schedule-condition.dto';

export class DailyRecurringScheduleConditionRequestDto extends DailyRecurringScheduleConditionDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: '시간은 HH:mm:ss 형식이어야 합니다',
  })
  time: string;
}
