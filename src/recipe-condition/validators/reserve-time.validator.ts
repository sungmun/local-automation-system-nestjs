import { Injectable } from '@nestjs/common';
import {
  RecipeCondition,
  RecipeConditionReserveTime,
  RecipeConditionType,
} from '../entities/recipe-condition.entity';
import { IConditionValidator } from './condition-validator.interface';

import { BaseValidator } from './base.validator';
import { RecipeValidator } from './validator.registry';
import { ValidationContext } from './validation-context';

@Injectable()
@RecipeValidator()
export class ReserveTimeValidator
  extends BaseValidator
  implements IConditionValidator
{
  canHandle(condition: RecipeCondition): boolean {
    return condition.type === RecipeConditionType.RESERVE_TIME;
  }

  async validate(context: ValidationContext): Promise<boolean> {
    const condition = context.condition as RecipeConditionReserveTime;
    const conditonTime = new Date(condition.reserveTime);
    const now = new Date();
    now.setSeconds(0, 0);

    return super.compareValues(now.getTime(), conditonTime.getTime(), '=');
  }
}
