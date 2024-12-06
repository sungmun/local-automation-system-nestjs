import { Expose } from 'class-transformer';
import { WeeklyRecurringScheduleConditionDto } from '../weekly-recurring-schedule-condition.dto';

export class WeeklyRecurringScheduleConditionResponseDto extends WeeklyRecurringScheduleConditionDto {
  id: number;

  @Expose({ name: 'dayOfWeeks' })
  _dayOfWeeks: string;

  get dayOfWeeks(): number[] {
    return this._dayOfWeeks.split(',').map(Number).sort();
  }
}
