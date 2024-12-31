import type {
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ValidatorConstraint } from 'class-validator';

@ValidatorConstraint({ name: 'isArrayUniqTypeValid', async: false })
export class IsArrayUniqTypeValid implements ValidatorConstraintInterface {
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
