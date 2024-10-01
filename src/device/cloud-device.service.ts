import { Injectable } from '@nestjs/common';
import { HejhomeApiService } from 'src/hejhome-api/hejhome-api.service';
import * as _ from 'lodash';

@Injectable()
export class CloudDeviceService {
  constructor(private readonly hejhomeApiService: HejhomeApiService) {}
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
