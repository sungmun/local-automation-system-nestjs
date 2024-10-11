import { Injectable, Logger } from '@nestjs/common';
import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';
import * as _ from 'lodash';
import {
  ResponseDevice,
  ResponseRoom,
} from '../hejhome-api/hejhome-api.interface';
import { Device } from './entities/device.entity';

@Injectable()
export class CloudDeviceService {
  private readonly logger = new Logger(CloudDeviceService.name);

  constructor(private readonly hejhomeApiService: HejhomeApiService) {}

  async getUniqueDevices(devices: ResponseDevice[]) {
    return _.uniqBy(devices.flat(), 'id');
  }

  async getDevices() {
    const devices = await this.hejhomeApiService.getDevices();
    return devices;
  }

  async getDevicesWithRoomId(
    roomsWithHomeId: (ResponseRoom & { homeId: number })[],
  ) {
    const devicesWithRoomId = await Promise.all(
      roomsWithHomeId.flat().map(async (room) => {
        const roomWithDevices = await this.hejhomeApiService.getRoomWithDevices(
          room.homeId,
          room.room_id,
        );
        return roomWithDevices.map((device) =>
          Object.assign(device, {
            roomId: room.room_id,
          }),
        );
      }),
    );
    return devicesWithRoomId.flat();
  }
}
