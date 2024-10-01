import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { ResponseDeviceStatus } from '../hejhome-api/hejhome-api.interface';
import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';

@Injectable()
export class DeviceStatusService {
  constructor(private readonly hejhomeApiService: HejhomeApiService) {}

  async getDeviceStatus<T extends ResponseDeviceStatus>(
    deviceId: string,
    deviceType: string,
  ) {
    if (deviceType === 'SensorTh') {
      return this.hejhomeApiService.getDeviceRawStatus(deviceId);
    }
    return this.hejhomeApiService.getDeviceStatus<T>(deviceId);
  }
}
