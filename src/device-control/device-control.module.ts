import { Module } from '@nestjs/common';
import { DeviceControlService } from './device-control.service';
import { HejhomeApiModule } from '../hejhome-api/hejhome-api.module';
import { TimerManagerModule } from '../timer-manager/timer-manager.module';
import { DeviceControlHandler } from './device-control.handler';

@Module({
  imports: [HejhomeApiModule, TimerManagerModule],
  controllers: [],
  providers: [DeviceControlService, DeviceControlHandler],
  exports: [DeviceControlService],
})
export class DeviceControlModule {}
