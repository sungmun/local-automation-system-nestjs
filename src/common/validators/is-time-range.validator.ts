import type {
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { registerDecorator } from 'class-validator';

class IsDateTimeRangeValidatorConstraint
  implements ValidatorConstraintInterface
{
  validate(endTime: string, args: ValidationArguments) {
    const [startTimeField] = args.constraints;
    const startTime = args.object[startTimeField];

    const startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);

    return startDateTime < endDateTime;
  }

  defaultMessage() {
    return '종료 시간은 시작 시간보다 커야합니다';
  }
}

export const IsDateTimeRange = (
  startTimeField: string,
  validationOptions?: ValidationOptions,
) => {
  return (object: unknown, propertyName: string) => {
    const cls = new IsDateTimeRangeValidatorConstraint();
    registerDecorator({
      name: 'IsDateTimeRange',
      target: object.constructor,
      constraints: [startTimeField],
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate: cls.validate,
        defaultMessage: cls.defaultMessage,
      },
    });
  };
};
