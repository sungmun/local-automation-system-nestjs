import { IsNotEmpty, IsString, IsInt, Min, IsObject } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDeviceCommandDto {
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
