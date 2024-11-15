import { Injectable, Type } from '@nestjs/common';
import { IConditionValidator } from './condition-validator.interface';

@Injectable()
export class ValidatorRegistry {
  private static validators: Type<IConditionValidator>[] = [];

  static register(validator: Type<IConditionValidator>) {
    ValidatorRegistry.validators.push(validator);
  }

  static getValidators(): Type<IConditionValidator>[] {
    return ValidatorRegistry.validators;
  }
}

export function RecipeValidator() {
  return function (target: Type<IConditionValidator>) {
    ValidatorRegistry.register(target);
  };
}
