import { IsNotEmpty, IsString, IsObject } from 'class-validator';
import { Transform } from 'class-transformer';
import { DeviceCommandDto } from '../device-command.dto';

export class CreateDeviceCommandRequestDto extends DeviceCommandDto {
  @IsObject()
  @IsNotEmpty()
  @Transform(({ value }) => JSON.stringify(value), { toPlainOnly: true })
  command: object;

  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
