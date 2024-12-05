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
  private readonly KST_OFFSET = 9 * 60 * 60000; // 한국 시간 오프셋 (9시간)

  canHandle(condition: RecipeCondition): boolean {
    return condition.type === RecipeConditionType.WEEKLY_RECURRING_SCHEDULE;
  }

  async validate(context: ValidationContext): Promise<boolean> {
    const condition =
      context.condition as RecipeConditionWeeklyRecurringSchedule;
    const now = this.getCurrentTime();

    return (
      this.isDayOfWeekMatch(condition.dayOfWeeks, now) &&
      this.isTimeMatch(condition.time, now)
    );
  }

  private getCurrentTime(): Date {
    const kstTime = new Date(Date.now() + this.KST_OFFSET);
    kstTime.setSeconds(0, 0);
    return kstTime;
  }

  private isDayOfWeekMatch(dayOfWeeks: string, date: Date): boolean {
    const currentDayOfWeek = date.getUTCDay().toString();
    const allowedDays = dayOfWeeks.split(',');
    return allowedDays.includes(currentDayOfWeek);
  }

  private isTimeMatch(scheduleTime: string, currentTime: Date): boolean {
    const [scheduleHours, scheduleMinutes] = this.parseTime(scheduleTime);

    return (
      this.compareValues(currentTime.getUTCHours(), scheduleHours, '=') &&
      this.compareValues(currentTime.getUTCMinutes(), scheduleMinutes, '=')
    );
  }

  private parseTime(time: string): [number, number] {
    const [hours, minutes] = time.split(':').map(Number);
    return [hours, minutes];
  }
}
