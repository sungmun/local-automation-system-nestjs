import { IsNotEmpty, IsString, IsObject, Validate } from 'class-validator';
import { plainToInstance, Transform } from 'class-transformer';
import { HejHomeDeviceStateConditionDto } from '../../recipe-conditions/hej-home-device-state-condition.dto';
import type { ComparisonOperator } from '../../../../recipe-condition/validators/base.validator';
import { IsRecordTypeValid } from '../../../../common/validators/is-record-type-valid-validator';

class DeviceStateValue {
  @IsNotEmpty()
  unit: ComparisonOperator;

  @IsNotEmpty()
  value: string | number;
}

export class HejHomeDeviceStateConditionRequestDto extends HejHomeDeviceStateConditionDto {
  @IsObject()
  @IsNotEmpty()
  @Validate(IsRecordTypeValid, [DeviceStateValue])
  @Transform(({ value }) =>
    Object.fromEntries(
      Object.entries(value).map(([key, value]) => [
        key,
        plainToInstance(DeviceStateValue, value),
      ]),
    ),
  )
  deviceState: Record<string, DeviceStateValue>;

  @IsNotEmpty()
  @IsString()
  deviceId: string;
}
