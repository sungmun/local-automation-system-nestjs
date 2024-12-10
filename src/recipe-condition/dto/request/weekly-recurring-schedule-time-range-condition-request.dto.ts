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
import { ApiProperty } from '@nestjs/swagger';
import { WeeklyRecurringScheduleTimeRangeConditionDto } from '../weekly-recurring-schedule-time-range-condition.dto';

export class WeeklyRecurringScheduleTimeRangeConditionRequestDto extends WeeklyRecurringScheduleTimeRangeConditionDto {
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

  @ApiProperty({
    description: '요일',
    example: [0, 1, 2, 3, 4, 5, 6],
    type: 'array',
    items: {
      type: 'number',
    },
    name: 'dayOfWeeks',
  })
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
