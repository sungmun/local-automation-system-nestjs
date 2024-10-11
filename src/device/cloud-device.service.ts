import { Injectable, Logger } from '@nestjs/common';
import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';
import * as _ from 'lodash';
import { ResponseRoom } from '../hejhome-api/hejhome-api.interface';
import { Device } from './entities/device.entity';
import { platform } from 'os';

@Injectable()
export class CloudDeviceService {
  private readonly logger = new Logger(CloudDeviceService.name);

  constructor(private readonly hejhomeApiService: HejhomeApiService) {}

  async getUniqueDevices(devices: Device[]) {
    const uniqueDevices = _.uniqBy(devices.flat(), 'id');
    return uniqueDevices;
  }

  async getDevices() {
    const devices = await this.hejhomeApiService.getDevices();
    return devices.map((device) =>
      Object.assign(device, { platform: 'hej-home' }),
    );
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
            platform: 'hej-home',
          }),
        );
      }),
    );
    return devicesWithRoomId.flat();
  }
}
