import { DataBaseDeviceService } from './database-device.service';
import { OnEvent } from '@nestjs/event-emitter';
import { ResponseDeviceState } from '../hejhome-api/hejhome-api.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeviceHandler {
  constructor(private readonly databaseDeviceService: DataBaseDeviceService) {}

  @OnEvent('finish.**', { async: true })
  async finishEvent(state: ResponseDeviceState) {
    await this.databaseDeviceService.updateState(state.id, state.deviceState);
  }

  @OnEvent('changed.**', { async: true })
  async changedDeviceSendMessage(state: ResponseDeviceState) {
    return this.databaseDeviceService.changedDeviceSendMessage(state);
  }
}
