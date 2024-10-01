import { Controller } from '@nestjs/common';
import { DataBaseDeviceService } from './database-device.service';

@Controller()
export class DeviceController {
  constructor(private readonly databaseDeviceService: DataBaseDeviceService) {}
}
