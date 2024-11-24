import type {
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ValidatorConstraint } from 'class-validator';

@ValidatorConstraint({ name: 'isDateTimeRangeValid', async: false })
export class IsDateTimeRangeValid implements ValidatorConstraintInterface {
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
