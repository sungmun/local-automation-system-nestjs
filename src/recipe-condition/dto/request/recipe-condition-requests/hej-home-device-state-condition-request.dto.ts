import { IsNotEmpty, IsString, IsObject } from 'class-validator';
import { plainToInstance, Transform } from 'class-transformer';
import { HejHomeDeviceStateConditionDto } from '../../recipe-conditions/hej-home-device-state-condition.dto';
import type { ComparisonOperator } from '../../../../recipe-condition/validators/base.validator';
import { IsRecordType } from '../../../../common/validators';

class DeviceStateValue {
  @IsNotEmpty()
  unit: ComparisonOperator;

  @IsNotEmpty()
  value: string | number;
}

export class HejHomeDeviceStateConditionRequestDto extends HejHomeDeviceStateConditionDto {
  @IsObject()
  @IsNotEmpty()
  @Transform(({ value }) =>
    Object.fromEntries(
      Object.entries(value).map(([key, value]) => [
        key,
        plainToInstance(DeviceStateValue, value),
      ]),
    ),
  )
  @IsRecordType(DeviceStateValue)
  deviceState: Record<string, DeviceStateValue>;

  @IsNotEmpty()
  @IsString()
  deviceId: string;
}
