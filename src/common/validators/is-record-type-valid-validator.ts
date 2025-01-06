import { ValidationError } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import type { ClassConstructor } from 'class-transformer';
import type {
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { isEmpty, validate, ValidatorConstraint } from 'class-validator';

@ValidatorConstraint({ name: 'isRecordTypeValid', async: true })
export class IsRecordTypeValid<T extends Record<string, unknown>>
  implements ValidatorConstraintInterface
{
  validationErrors: ValidationError[][] = [];
  async validate(
    record: Record<string, T>,
    validationArguments: ValidationArguments,
  ): Promise<boolean> {
    const ClassTransformer = validationArguments
      .constraints?.[0] as ClassConstructor<T>;
    if (isEmpty(record)) {
      return false;
    }
    if (!ClassTransformer) {
      return false;
    }

    const values = Object.values(record);

    this.validationErrors = await Promise.all(
      values.map((value) => validate(plainToInstance(ClassTransformer, value))),
    );

    return this.validationErrors.every(
      (validationError) => validationError.length <= 0,
    );
  }

  defaultMessage() {
    return this.validationErrors
      .map((errors) =>
        errors
          .reduce(
            (acc, error) =>
              error.constraints
                ? [...acc, ...Object.values(error.constraints)]
                : acc,
            [],
          )
          .join(', '),
      )
      .join(', ');
  }
}
