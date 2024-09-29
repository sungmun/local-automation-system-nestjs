import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { ResponseDeviceStatus } from '../hejhome-api/hejhome-api.interface';
import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';

@Injectable()
export class DeviceStatusService {
  constructor(private readonly hejhomeApiService: HejhomeApiService) {}

  async getDeviceStatus<T extends ResponseDeviceStatus>(
    deviceId: number,
    deviceType: string,
  ) {
    if (deviceType === 'SensorTh') {
      return this.hejhomeApiService.getDeviceRawStatus(deviceId);
    }
    return this.hejhomeApiService.getDeviceStatus<T>(deviceId);
  }

  async getUniqueDevices() {
    const devices = await Promise.all([
      this.getDevices(),
      this.getDevicesWithRoomId(),
    ]);

    const uniqueDevices = _.uniqBy(devices.flat(), 'id');
    return uniqueDevices;
  }

  async getDevices() {
    const devices = await this.hejhomeApiService.getDevices();
    return devices;
  }

  async getDevicesWithRoomId() {
    const homes = await this.hejhomeApiService.getHomes();

    const roomsWithHomeId = await Promise.all(
      homes.map(async ({ homeId }) => {
        const homeWithRooms =
          await this.hejhomeApiService.getHomeWithRooms(homeId);
        return homeWithRooms.rooms.map((room) =>
          Object.assign(room, { homeId }),
        );
      }),
    );

    const devicesWithRoomId = await Promise.all(
      roomsWithHomeId.flat().map(async (room) => {
        const roomWithDevices = await this.hejhomeApiService.getRoomWithDevices(
          room.homeId,
          room.room_id,
        );
        return roomWithDevices.map((device) =>
          Object.assign(device, { roomId: room.room_id }),
        );
      }),
    );
    return devicesWithRoomId.flat();
  }
}
