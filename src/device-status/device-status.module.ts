import { Module } from '@nestjs/common';
import { DeviceStatusService } from './device-status.service';
import { DeviceStatusController } from './device-status.controller';

@Module({
  controllers: [DeviceStatusController],
  providers: [DeviceStatusService],
})
export class DeviceStatusModule {}
