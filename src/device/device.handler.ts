import { DataBaseDeviceService } from './database-device.service';
import { ResponseDeviceState } from '../hejhome-api/hejhome-api.interface';
import { Injectable } from '@nestjs/common';
import { OnSafeEvent } from '../common/decorators/safe-event.decoratot';

@Injectable()
export class DeviceHandler {
  constructor(private readonly databaseDeviceService: DataBaseDeviceService) {}

  @OnSafeEvent('changed.**', { async: true })
  async changedDeviceSendMessage(state: ResponseDeviceState) {
    await this.databaseDeviceService.updateState(state.id, state.deviceState);
    await this.databaseDeviceService.changedDeviceSendMessage(state);
  }
}
