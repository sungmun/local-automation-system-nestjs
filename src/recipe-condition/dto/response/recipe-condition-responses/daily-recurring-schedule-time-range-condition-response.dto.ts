import { ApiProperty } from '@nestjs/swagger';
import { DailyRecurringScheduleTimeRangeConditionDto } from '../../recipe-conditions/daily-recurring-schedule-time-range-condition.dto';

export class DailyRecurringScheduleTimeRangeConditionResponseDto extends DailyRecurringScheduleTimeRangeConditionDto {
  @ApiProperty({
    description: '조건 아이디',
    example: 1,
  })
  id: number;
}
