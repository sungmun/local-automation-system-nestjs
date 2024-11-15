import { ValidationContext } from './validation-context';

type ComparisonOperator = '<' | '>' | '=' | '>=' | '<=';

export abstract class BaseValidator {
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
