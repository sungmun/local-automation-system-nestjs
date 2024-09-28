import { Controller } from '@nestjs/common';
import { DeviceControlService } from './device-control.service';

@Controller()
export class DeviceControlController {
  constructor(private readonly deviceControlService: DeviceControlService) {}
}
