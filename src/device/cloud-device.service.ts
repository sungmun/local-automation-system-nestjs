import { Injectable, Logger } from '@nestjs/common';
import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';
import * as _ from 'lodash';
import {
  ResponseDevice,
  ResponseRoom,
} from '../hejhome-api/hejhome-api.interface';
import { plainToInstance } from 'class-transformer';
import { RoomWithDeviceDto } from './dto/room-with-device.dto';
import { DeviceDto } from './dto/device.dto';

@Injectable()
export class CloudDeviceService {
  private readonly logger = new Logger(CloudDeviceService.name);

  constructor(private readonly hejhomeApiService: HejhomeApiService) {}

  async getUniqueDevices(devices: ResponseDevice[]) {
    return _.uniqBy(devices.flat(), 'id');
  }

  async getDevices() {
    const hejhomeDevices = await this.hejhomeApiService.getDevices();

    const devices = hejhomeDevices.map((device) =>
      plainToInstance(DeviceDto, device),
    );

    return devices;
  }

  async getDevicesWithRoomId(
    roomsWithHomeId: (ResponseRoom & { homeId: number })[],
  ): Promise<RoomWithDeviceDto[]> {
    const devicesWithRoomId = await Promise.all(
      roomsWithHomeId.map(async (room): Promise<RoomWithDeviceDto[]> => {
        const roomWithDevices = await this.hejhomeApiService.getRoomWithDevices(
          room.homeId,
          room.room_id,
        );
        return roomWithDevices.map(
          (device) => new RoomWithDeviceDto(device, room.room_id),
        );
      }),
    );
    return devicesWithRoomId.flat();
  }
}
