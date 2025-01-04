import { RecipeCondition } from '../entities/recipe-condition.entity';
import { IConditionValidator } from './condition-validator.interface';
import { ValidationContext } from './validation-context';

export type ComparisonOperator = '<' | '>' | '=' | '>=' | '<=';

export abstract class BaseValidator implements IConditionValidator {
  abstract canHandle(condition: Pick<RecipeCondition, 'type'>): boolean;
  abstract validate(context: ValidationContext): Promise<boolean>;

  protected compareValues(
    value1: number,
    value2: number,
    operator: ComparisonOperator,
  ): boolean {
    const comparators: Record<
      ComparisonOperator,
      (a: number, b: number) => boolean
    > = {
      '<': (a, b) => a < b,
      '>': (a, b) => a > b,
      '=': (a, b) => a === b,
      '>=': (a, b) => a >= b,
      '<=': (a, b) => a <= b,
    };
    return comparators[operator](value1, value2);
  }
}
