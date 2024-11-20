import { Inject, Injectable } from '@nestjs/common';

import { RecipeCondition } from '../entities/recipe-condition.entity';
import { IConditionValidator } from './condition-validator.interface';

@Injectable()
export class ConditionValidatorFactory {
  constructor(
    @Inject('CONDITION_VALIDATORS')
    private readonly validators: IConditionValidator[],
  ) {}

  getValidator(condition: RecipeCondition): IConditionValidator {
    const validator = this.validators.find((v) => v.canHandle(condition));
    if (!validator) {
      throw new Error(
        `No validator found for condition type: ${condition.type}`,
      );
    }
    return validator;
  }
}
