import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import _ from 'lodash';
import { AuthService } from '../auth/auth.service';

import { CloudDeviceService } from 'src/device/cloud-device.service';
import { DataBaseDeviceService } from 'src/device/database-device.service';

import { TaskService } from 'src/task/task.service';
import { RoomService } from 'src/room/room.service';

@Injectable()
export class InitService implements OnModuleInit {
  private readonly logger = new Logger(InitService.name);
  constructor(
    private readonly authService: AuthService,
    private readonly cloudDeviceService: CloudDeviceService,
    private readonly databaseDeviceService: DataBaseDeviceService,
    private readonly roomService: RoomService,
    private readonly taskService: TaskService,
  ) {}

  private async initRooms() {
    const rooms = await this.roomService.getHomesWithRooms();
    await this.roomService.initRooms(
      rooms.map((room) => ({ ...room, id: room.room_id })),
    );
    return rooms;
  }
  private async initDevice(homeWithRooms) {
    const devices = await Promise.all([
      this.cloudDeviceService.getDevicesWithRoomId(homeWithRooms),
      this.cloudDeviceService.getDevices(),
    ]);

    const uniqueDevices = await this.cloudDeviceService.getUniqueDevices(
      devices.flat(),
    );

    await this.databaseDeviceService.bulkInsert(uniqueDevices);
    return uniqueDevices;
  }

  async onModuleInit() {
    try {
      this.logger.log('onModuleInit start');
      await this.authService.setRefreshToken();
      const rooms = await this.initRooms();
      await this.initDevice(rooms);
      for (const room of rooms) {
        await this.roomService.matchRoomWithSensor(room.room_id);
      }
      this.logger.log('onModuleInit success');
      this.logger.log('onModuleInit api check');
      this.taskService.hejhomeAPICheck();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
