import { Injectable } from '@nestjs/common';
import {
  RecipeCondition,
  RecipeConditionType,
} from '../entities/recipe-condition.entity';
import { IConditionValidator } from './condition-validator.interface';
import { BaseValidator } from './base.validator';
import { RecipeValidator } from './validator.registry';
import { ValidationContext } from './validation-context';
import type { RecipeConditionDailyRecurringScheduleTimeRange } from '../entities/child-recipe-conditions';

@Injectable()
@RecipeValidator()
export class DailyRecurringScheduleTimeRangeValidator
  extends BaseValidator
  implements IConditionValidator
{
  private readonly MINUTES_PER_HOUR = 60;
  private readonly END_OF_DAY = '23:59';
  private readonly START_OF_DAY = '00:00';
  private readonly KST_OFFSET = 9 * 60 * 60000; // 한국 시간 오프셋 (9시간)

  canHandle(condition: RecipeCondition): boolean {
    return (
      condition.type === RecipeConditionType.DAILY_RECURRING_SCHEDULE_TIME_RANGE
    );
  }

  async validate(context: ValidationContext): Promise<boolean> {
    const condition =
      context.condition as RecipeConditionDailyRecurringScheduleTimeRange;
    const now = this.getCurrentTime();

    return this.isWithinTimeRange(condition, now);
  }

  private getCurrentTime(): Date {
    const kstTime = new Date(Date.now() + this.KST_OFFSET);
    kstTime.setSeconds(0, 0);
    return kstTime;
  }

  private isWithinTimeRange(
    condition: RecipeConditionDailyRecurringScheduleTimeRange,
    currentTime: Date,
  ): boolean {
    const startTimeInMinutes = this.convertTimeToMinutes(condition.startTime);
    const endTimeInMinutes = this.convertTimeToMinutes(condition.endTime);

    return startTimeInMinutes > endTimeInMinutes
      ? this.handleCrossMidnightCase(condition, currentTime)
      : this.handleNormalCase(condition, currentTime);
  }

  private handleCrossMidnightCase(
    condition: RecipeConditionDailyRecurringScheduleTimeRange,
    currentTime: Date,
  ): boolean {
    return (
      this.isTimeInRange(condition.startTime, this.END_OF_DAY, currentTime) ||
      this.isTimeInRange(this.START_OF_DAY, condition.endTime, currentTime)
    );
  }

  private handleNormalCase(
    condition: RecipeConditionDailyRecurringScheduleTimeRange,
    currentTime: Date,
  ): boolean {
    return this.isTimeInRange(
      condition.startTime,
      condition.endTime,
      currentTime,
    );
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
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
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
