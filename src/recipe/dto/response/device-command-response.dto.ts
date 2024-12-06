import { DeviceCommandDto } from '../device-command.dto';

export class DeviceCommandResponseDto extends DeviceCommandDto {
  id: number;
  platform: string;
  order: number;
}
