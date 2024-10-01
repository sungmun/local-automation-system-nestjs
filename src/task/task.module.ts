import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { DeviceModule } from 'src/device/device.module';
import { DeviceStatusModule } from 'src/device-status/device-status.module';
import { HejhomeMessageQueueModule } from 'src/hejhome-message-queue/hejhome-message-queue.module';

@Module({
  imports: [DeviceModule, DeviceStatusModule, HejhomeMessageQueueModule],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
