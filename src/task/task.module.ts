import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { DeviceModule } from 'src/device/device.module';
import { HejhomeMessageQueueModule } from 'src/hejhome-message-queue/hejhome-message-queue.module';
import { DeviceStateModule } from 'src/device-state/device-state.module';

@Module({
  imports: [DeviceModule, DeviceStateModule, HejhomeMessageQueueModule],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
