import { ValidationError } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import type { ClassConstructor } from 'class-transformer';
import type {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isEmpty, registerDecorator, validate } from 'class-validator';

class IsRecordTypeValidatorConstraint implements ValidatorConstraintInterface {
  validationErrors: ValidationError[][] = [];
  async validate(
    record: Record<string, unknown>,
    validationArguments: ValidationArguments,
  ): Promise<boolean> {
    const ClassTransformer = validationArguments.constraints?.[0];
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
    const message = this.validationErrors
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
    return message;
  }
}

export const IsRecordType = <T>(
  recordClassType: ClassConstructor<T>,
  validationOptions?: ValidationOptions,
) => {
  return (object: unknown, propertyName: string) => {
    const cls = new IsRecordTypeValidatorConstraint();
    registerDecorator({
      name: 'IsRecordType',
      target: object.constructor,
      constraints: [recordClassType],
      propertyName: propertyName,
      options: validationOptions,
      async: true,
      validator: {
        validate: cls.validate,
        defaultMessage: cls.defaultMessage,
      },
    });
  };
};
