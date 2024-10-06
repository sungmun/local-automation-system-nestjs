import { Module } from '@nestjs/common';
import { DeviceStateService } from './device-state.service';
import { DeviceStateController } from './device-state.controller';
import { HejhomeApiModule } from '../hejhome-api/hejhome-api.module';
import { DeviceModule } from '../device/device.module';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [HejhomeApiModule, DeviceModule, RoomModule],
  controllers: [DeviceStateController],
  providers: [DeviceStateService],
  exports: [DeviceStateService],
})
export class DeviceStateModule {}
