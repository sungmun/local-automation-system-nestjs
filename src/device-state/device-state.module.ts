import { Module } from '@nestjs/common';
import { DeviceStateService } from './device-state.service';
import { HejhomeApiModule } from '../hejhome-api/hejhome-api.module';
import { DeviceModule } from '../device/device.module';
import { RoomModule } from '../room/room.module';
import { DeviceStateHandler } from './device-state.handler';

@Module({
  imports: [HejhomeApiModule, DeviceModule, RoomModule],
  controllers: [],
  providers: [DeviceStateService, DeviceStateHandler],
  exports: [DeviceStateService],
})
export class DeviceStateModule {}
