import { plainToInstance } from 'class-transformer';
import type { ClassConstructor } from 'class-transformer';
import type {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';
import {
  isEmpty,
  isNotEmptyObject,
  registerDecorator,
  validate,
  ValidationError,
} from 'class-validator';

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
    if (!isNotEmptyObject(record)) {
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

  defaultMessage(args: ValidationArguments) {
    if (isEmpty(args.value) || !isNotEmptyObject(args.value)) {
      return '레코드가 비어있습니다';
    }
    if (!args.constraints?.[0]) {
      return '유효하지 않은 레코드입니다';
    }

    const message = this.validationErrors
      .map((errors) =>
        errors
          .reduce(
            (acc, error) => acc.concat(...Object.values(error.constraints)),
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
