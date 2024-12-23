import { Expose } from 'class-transformer';
import { WeeklyRecurringScheduleConditionDto } from '../../recipe-conditions/weekly-recurring-schedule-condition.dto';
import { ApiProperty } from '@nestjs/swagger';

export class WeeklyRecurringScheduleConditionResponseDto extends WeeklyRecurringScheduleConditionDto {
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
