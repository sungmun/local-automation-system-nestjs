import { Type } from 'class-transformer';
import { DeviceDto } from '../device.dto';

export class ListDeviceResponseDto {
  @Type(() => DeviceDto)
  list: DeviceDto[];
}
