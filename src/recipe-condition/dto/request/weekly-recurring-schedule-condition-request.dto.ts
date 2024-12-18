import {
  IsNotEmpty,
  IsArray,
  IsNumber,
  Matches,
  IsString,
  ArrayMinSize,
  ArrayMaxSize,
  Min,
  Max,
} from 'class-validator';

import { Expose } from 'class-transformer';
import { WeeklyRecurringScheduleConditionDto } from '../weekly-recurring-schedule-condition.dto';

export class WeeklyRecurringScheduleConditionRequestDto extends WeeklyRecurringScheduleConditionDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: '시간은 HH:mm:ss 형식이어야 합니다',
  })
  time: string;

  @Expose({ name: 'dayOfWeeks' })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  _dayOfWeeks: number[];

  get dayOfWeeks(): string {
    return Array.from(new Set(this._dayOfWeeks)).sort().join(',');
  }
}
