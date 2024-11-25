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
    const timeData = new Date(condition.time);
    const now = new Date();

    return (
      condition.dayOfWeeks.split(',').includes(now.getDay().toString()) &&
      this.compareValues(now.getHours(), timeData.getHours(), '=') &&
      this.compareValues(now.getMinutes(), timeData.getMinutes(), '=')
    );
  }
}
