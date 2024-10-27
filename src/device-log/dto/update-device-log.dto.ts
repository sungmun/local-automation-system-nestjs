import { PartialType } from '@nestjs/mapped-types';
import { CreateDeviceLogDto } from './create-device-log.dto';

export class UpdateDeviceLogDto extends PartialType(CreateDeviceLogDto) {
  id: number;
}
