import { DataBaseDeviceService } from './database-device.service';
import { OnEvent } from '@nestjs/event-emitter';
import { ResponseDeviceState } from '../hejhome-api/hejhome-api.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeviceHandler {
  constructor(private readonly databaseDeviceService: DataBaseDeviceService) {}

  @OnEvent('changed.**', { async: true })
  async changedDeviceSendMessage(state: ResponseDeviceState) {
    await this.databaseDeviceService.updateState(state.id, state.deviceState);
    return this.databaseDeviceService.changedDeviceSendMessage(state);
  }
}
