import { Module } from '@nestjs/common';
import { DeviceStateService } from './device-state.service';
import { DeviceStateController } from './device-state.controller';
import { HejhomeApiModule } from 'src/hejhome-api/hejhome-api.module';
import { DeviceModule } from 'src/device/device.module';
import { RoomModule } from 'src/room/room.module';

@Module({
  imports: [HejhomeApiModule, DeviceModule, RoomModule],
  controllers: [DeviceStateController],
  providers: [DeviceStateService],
  exports: [DeviceStateService],
})
export class DeviceStateModule {}
