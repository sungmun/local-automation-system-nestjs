import { Injectable } from '@nestjs/common';
import {
  RecipeCondition,
  RecipeConditionType,
} from '../entities/recipe-condition.entity';
import { IConditionValidator } from './condition-validator.interface';

import { BaseValidator } from './base.validator';
import { RecipeValidator } from './validator.registry';
import { ValidationContext } from './validation-context';
import type { RecipeConditionWeeklyRecurringScheduleTimeRange } from '../entities/child-recipe-conditions';

@Injectable()
@RecipeValidator()
export class WeeklyRecurringScheduleTimeRangeValidator
  extends BaseValidator
  implements IConditionValidator
{
  canHandle(condition: RecipeCondition): boolean {
    return (
      condition.type ===
      RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE
    );
  }

  async validate(context: ValidationContext): Promise<boolean> {
    const condition =
      context.condition as RecipeConditionWeeklyRecurringScheduleTimeRange;
    const now = this.getCurrentTimeInKST();

    return (
      this.isDayOfWeekMatch(condition.dayOfWeeks, now) &&
      this.isTimeInRange(condition.startTime, condition.endTime, now)
    );
  }

  private isDayOfWeekMatch(dayOfWeeks: string, date: Date): boolean {
    const currentDayOfWeek = date.getDay().toString();
    const allowedDays = dayOfWeeks.split(',');
    return allowedDays.includes(currentDayOfWeek);
  }

  private isTimeInRange(
    startTime: string,
    endTime: string,
    currentTime: Date,
  ): boolean {
    const startTimeInMinutes = this.convertTimeToMinutes(startTime);
    const endTimeInMinutes = this.convertTimeToMinutes(endTime);

    const currentTimeInMinutes = this.convertTimeToMinutes(
      `${`${currentTime.getHours()}`.padStart(2, '0')}:${`${currentTime.getMinutes()}`.padStart(2, '0')}`,
    );

    if (startTimeInMinutes > endTimeInMinutes) {
      return (
        this.compareValues(currentTimeInMinutes, startTimeInMinutes, '>=') ||
        this.compareValues(currentTimeInMinutes, endTimeInMinutes, '<=')
      );
    }

    return (
      this.compareValues(currentTimeInMinutes, startTimeInMinutes, '>=') &&
      this.compareValues(currentTimeInMinutes, endTimeInMinutes, '<=')
    );
  }

  convertTimeToMinutes(time: string): number {
    const [hours, minutes] = this.parseTime(time);
    return hours * 60 + minutes;
  }

  private parseTime(time: string): [number, number] {
    const [hours, minutes] = time.split(':').map(Number);
    return [hours, minutes];
  }

  private getCurrentTimeInKST(): Date {
    const now = new Date();
    now.setSeconds(0, 0);
    const utc = now.getTime();
    const kstOffset = 9 * 60 * 60000;
    const kstTime = new Date(utc - kstOffset);
    return kstTime;
  }
}
