import { Module } from '@nestjs/common';
import { DeviceControlService } from './device-control.service';
import { DeviceControlController } from './device-control.controller';
import { HejhomeApiModule } from '../hejhome-api/hejhome-api.module';
import { TimerManagerModule } from '../timer-manager/timer-manager.module';

@Module({
  imports: [HejhomeApiModule, TimerManagerModule],
  controllers: [DeviceControlController],
  providers: [DeviceControlService],
  exports: [DeviceControlService],
})
export class DeviceControlModule {}
