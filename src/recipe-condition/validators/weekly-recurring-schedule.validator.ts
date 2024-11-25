import { Injectable } from '@nestjs/common';
import {
  RecipeCondition,
  RecipeConditionType,
} from '../entities/recipe-condition.entity';
import { IConditionValidator } from './condition-validator.interface';

import { BaseValidator } from './base.validator';
import { RecipeValidator } from './validator.registry';
import { ValidationContext } from './validation-context';
import type { RecipeConditionWeeklyRecurringSchedule } from '../entities/child-recipe-conditions';

@Injectable()
@RecipeValidator()
export class WeeklyRecurringScheduleValidator
  extends BaseValidator
  implements IConditionValidator
{
  canHandle(condition: RecipeCondition): boolean {
    return condition.type === RecipeConditionType.WEEKLY_RECURRING_SCHEDULE;
  }

  async validate(context: ValidationContext): Promise<boolean> {
    const condition =
      context.condition as RecipeConditionWeeklyRecurringSchedule;
    const now = this.getCurrentTimeInKST();

    return (
      this.isDayOfWeekMatch(condition.dayOfWeeks, now) &&
      this.isTimeMatch(condition.time, now)
    );
  }

  private isDayOfWeekMatch(dayOfWeeks: string, date: Date): boolean {
    const currentDayOfWeek = date.getDay().toString();
    const allowedDays = dayOfWeeks.split(',');
    return allowedDays.includes(currentDayOfWeek);
  }

  private isTimeMatch(scheduleTime: string, currentTime: Date): boolean {
    const [hours, minutes] = this.parseTime(scheduleTime);
    return (
      this.compareValues(currentTime.getHours(), hours, '=') &&
      this.compareValues(currentTime.getMinutes(), minutes, '=')
    );
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
