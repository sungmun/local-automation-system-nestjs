import type { ClassConstructor } from 'class-transformer';
import type {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';
import { registerDecorator } from 'class-validator';

class IsArrayUniqTypeValidatorConstraint
  implements ValidatorConstraintInterface
{
  validate(array: any[], args: ValidationArguments) {
    const uniqClassType = args.constraints[0];

    const currentObject = array.filter(
      (item) => item.constructor === uniqClassType,
    );
    return currentObject.length <= 1;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.constraints[0]} 타입은 배열에 하나만 존재해야 합니다.`;
  }
}

export const IsArrayUniqType = (
  uniqClassType: ClassConstructor<unknown>,
  validationOptions?: ValidationOptions,
) => {
  return (object: unknown, propertyName: string) => {
    const cls = new IsArrayUniqTypeValidatorConstraint();
    registerDecorator({
      name: 'IsArrayUniqType',

      target: object.constructor,
      constraints: [uniqClassType],
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate: cls.validate,
        defaultMessage: cls.defaultMessage,
      },
    });
  };
};
