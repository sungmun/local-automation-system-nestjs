import { Controller } from '@nestjs/common';
import { DeviceListenerService } from './device-listener.service';

@Controller()
export class DeviceListenerController {
  constructor(private readonly deviceListenerService: DeviceListenerService) {}
}
