import { Controller } from '@nestjs/common';
import { DeviceLogService } from './device-log.service';

@Controller()
export class DeviceLogController {
  constructor(private readonly deviceLogService: DeviceLogService) {}
}
