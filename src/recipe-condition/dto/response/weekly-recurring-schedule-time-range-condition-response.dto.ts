import { Expose } from 'class-transformer';
import { WeeklyRecurringScheduleTimeRangeConditionDto } from '../weekly-recurring-schedule-time-range-condition.dto';

export class WeeklyRecurringScheduleTimeRangeConditionResponseDto extends WeeklyRecurringScheduleTimeRangeConditionDto {
  id: number;

  @Expose({ name: 'dayOfWeeks' })
  _dayOfWeeks: string;

  get dayOfWeeks(): number[] {
    return this._dayOfWeeks.split(',').map(Number).sort();
  }
}
