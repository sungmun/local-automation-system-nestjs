import { Controller, Logger } from '@nestjs/common';
import { DataBaseDeviceService } from './database-device.service';
import { OnEvent } from '@nestjs/event-emitter';
import { ResponseDeviceState } from '../hejhome-api/hejhome-api.interface';

@Controller()
export class DeviceController {
  constructor(private readonly databaseDeviceService: DataBaseDeviceService) {}

  @OnEvent('finish.**', { async: true })
  async FinishEvent(state: ResponseDeviceState) {
    await this.databaseDeviceService.updateState(state.id, state.deviceState);
  }
}
