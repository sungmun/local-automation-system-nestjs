import { Module } from '@nestjs/common';
import { DeviceControlService } from './device-control.service';
import { DeviceControlController } from './device-control.controller';

@Module({
  controllers: [DeviceControlController],
  providers: [DeviceControlService],
})
export class DeviceControlModule {}
