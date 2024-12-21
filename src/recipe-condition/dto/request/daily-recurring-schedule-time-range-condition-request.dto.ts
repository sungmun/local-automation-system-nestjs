import { IsNotEmpty, Matches, IsString } from 'class-validator';
import { DailyRecurringScheduleTimeRangeConditionDto } from '../daily-recurring-schedule-time-range-condition.dto';

export class DailyRecurringScheduleTimeRangeConditionRequestDto extends DailyRecurringScheduleTimeRangeConditionDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: '시간은 HH:mm:ss 형식이어야 합니다',
  })
  startTime: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: '시간은 HH:mm:ss 형식이어야 합니다',
  })
  endTime: string;
}
