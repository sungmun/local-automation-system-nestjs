import { Controller } from '@nestjs/common';
import { DeviceStatusService } from './device-status.service';

@Controller()
export class DeviceStatusController {
  constructor(private readonly deviceStatusService: DeviceStatusService) {}
}
