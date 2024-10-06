import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { DeviceModule } from '../device/device.module';
import { HejhomeMessageQueueModule } from '../hejhome-message-queue/hejhome-message-queue.module';
import { DeviceStateModule } from '../device-state/device-state.module';

@Module({
  imports: [DeviceModule, DeviceStateModule, HejhomeMessageQueueModule],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
