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
  private readonly MINUTES_PER_HOUR = 60;
  private readonly END_OF_DAY = '23:59';
  private readonly START_OF_DAY = '00:00';

  canHandle(condition: RecipeCondition): boolean {
    return (
      condition.type ===
      RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE
    );
  }

  async validate(context: ValidationContext): Promise<boolean> {
    const condition =
      context.condition as RecipeConditionWeeklyRecurringScheduleTimeRange;
    const now = this.getCurrentTime();

    return this.isWithinTimeRange(condition, now);
  }

  private getCurrentTime(): Date {
    const now = new Date();
    now.setSeconds(0, 0);
    return now;
  }

  private isWithinTimeRange(
    condition: RecipeConditionWeeklyRecurringScheduleTimeRange,
    currentTime: Date,
  ): boolean {
    const startTimeInMinutes = this.convertTimeToMinutes(condition.startTime);
    const endTimeInMinutes = this.convertTimeToMinutes(condition.endTime);
    const todayMatch = this.isDayOfWeekMatch(condition.dayOfWeeks, currentTime);

    return startTimeInMinutes > endTimeInMinutes
      ? this.handleCrossMidnightCase(condition, currentTime, todayMatch)
      : this.handleNormalCase(condition, currentTime, todayMatch);
  }

  private handleCrossMidnightCase(
    condition: RecipeConditionWeeklyRecurringScheduleTimeRange,
    currentTime: Date,
    todayMatch: boolean,
  ): boolean {
    const yesterday = this.getPreviousDay(currentTime);
    const yesterdayMatch = this.isDayOfWeekMatch(
      condition.dayOfWeeks,
      yesterday,
    );

    return (
      (todayMatch &&
        this.isTimeInRange(
          condition.startTime,
          this.END_OF_DAY,
          currentTime,
        )) ||
      (yesterdayMatch &&
        this.isTimeInRange(this.START_OF_DAY, condition.endTime, currentTime))
    );
  }

  private handleNormalCase(
    condition: RecipeConditionWeeklyRecurringScheduleTimeRange,
    currentTime: Date,
    todayMatch: boolean,
  ): boolean {
    return (
      todayMatch &&
      this.isTimeInRange(condition.startTime, condition.endTime, currentTime)
    );
  }

  private getPreviousDay(date: Date): Date {
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
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
      this.formatTime(currentTime),
    );

    return (
      this.compareValues(currentTimeInMinutes, startTimeInMinutes, '>=') &&
      this.compareValues(currentTimeInMinutes, endTimeInMinutes, '<=')
    );
  }

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private convertTimeToMinutes(time: string): number {
    const [hours, minutes] = this.parseTime(time);
    return hours * this.MINUTES_PER_HOUR + minutes;
  }

  private parseTime(time: string): [number, number] {
    const [hours, minutes] = time.split(':').map(Number);
    return [hours, minutes];
  }
}
