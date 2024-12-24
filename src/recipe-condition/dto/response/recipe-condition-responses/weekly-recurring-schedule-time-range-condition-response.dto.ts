import { Expose } from 'class-transformer';
import { WeeklyRecurringScheduleTimeRangeConditionDto } from '../../recipe-conditions/weekly-recurring-schedule-time-range-condition.dto';
import { ApiProperty } from '@nestjs/swagger';

export class WeeklyRecurringScheduleTimeRangeConditionResponseDto extends WeeklyRecurringScheduleTimeRangeConditionDto {
  @ApiProperty({
    description: '조건 아이디',
    example: 1,
  })
  id: number;

  @Expose({ name: 'dayOfWeeks' })
  _dayOfWeeks: string;

  @ApiProperty({
    description: '요일 목록',
    example: [1, 2, 3],
    type: 'array',
    items: {
      type: 'number',
    },
  })
  get dayOfWeeks(): number[] {
    return this._dayOfWeeks.split(',').map(Number).sort();
  }
}
