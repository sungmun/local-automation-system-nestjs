import { Injectable, Logger } from '@nestjs/common';
import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';
import { ResponseDeviceState } from '../hejhome-api/hejhome-api.interface';
import { DataBaseDeviceService } from '../device/database-device.service';

@Injectable()
export class DeviceStateService {
  private readonly logger = new Logger(DeviceStateService.name);
  constructor(
    private readonly hejhomeApiService: HejhomeApiService,
    private readonly databaseDeviceService: DataBaseDeviceService,
  ) {}

  async getDeviceState<T extends ResponseDeviceState>(
    deviceId: string,
    deviceType: string,
  ) {
    if (deviceType === 'SensorTh') {
      return this.hejhomeApiService.getDeviceRawState(deviceId);
    }
    return this.hejhomeApiService.getDeviceState<T>(deviceId);
  }

  async hasChanged(deviceId: string, state: ResponseDeviceState) {
    const device = await this.databaseDeviceService.findOne(deviceId);
    const stringState = JSON.stringify(state.deviceState);

    return device.state !== stringState;
  }
}
