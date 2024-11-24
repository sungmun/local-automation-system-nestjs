import { Injectable } from '@nestjs/common';
import {
  RecipeCondition,
  RecipeConditionType,
} from '../entities/recipe-condition.entity';
import { IConditionValidator } from './condition-validator.interface';

import { BaseValidator } from './base.validator';
import { RecipeValidator } from './validator.registry';
import { ValidationContext } from './validation-context';
import type { RecipeConditionReserveTimeRange } from '../entities/child-recipe-conditions';

@Injectable()
@RecipeValidator()
export class ReserveTimeRangeValidator
  extends BaseValidator
  implements IConditionValidator
{
  canHandle(condition: RecipeCondition): boolean {
    return condition.type === RecipeConditionType.RESERVE_TIME_RANGE;
  }

  async validate(context: ValidationContext): Promise<boolean> {
    const condition = context.condition as RecipeConditionReserveTimeRange;
    const startTime = new Date(condition.reserveStartTime);
    const endTime = new Date(condition.reserveEndTime);
    const now = new Date();
    now.setSeconds(0, 0);

    return (
      super.compareValues(now.getTime(), startTime.getTime(), '>=') &&
      super.compareValues(now.getTime(), endTime.getTime(), '<=')
    );
  }
}
