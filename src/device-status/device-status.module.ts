import { Module } from '@nestjs/common';
import { DeviceStatusService } from './device-status.service';
import { DeviceStatusController } from './device-status.controller';
import { HejhomeApiModule } from '../hejhome-api/hejhome-api.module';

@Module({
  imports: [HejhomeApiModule],
  controllers: [DeviceStatusController],
  providers: [DeviceStatusService],
  exports: [DeviceStatusService],
})
export class DeviceStatusModule {}
