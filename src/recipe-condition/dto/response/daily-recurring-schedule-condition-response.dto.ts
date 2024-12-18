import { ApiProperty } from '@nestjs/swagger';
import { DailyRecurringScheduleConditionDto } from '../daily-recurring-schedule-condition.dto';

export class DailyRecurringScheduleConditionResponseDto extends DailyRecurringScheduleConditionDto {
  @ApiProperty({
    description: '조건 아이디',
    example: 1,
  })
  id: number;
}
