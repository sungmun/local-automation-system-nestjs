import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { DeviceModule } from '../device/device.module';
import { HejhomeMessageQueueModule } from '../hejhome-message-queue/hejhome-message-queue.module';
import { DeviceStateModule } from '../device-state/device-state.module';
import { RecipeCheckService } from './recipe-check.service';
import { DeviceCheckService } from './device-check.service';
import { RecipeConditionModule } from '../recipe-condition/recipe-condition.module';

@Module({
  imports: [
    DeviceModule,
    DeviceStateModule,
    HejhomeMessageQueueModule,
    RecipeConditionModule,
  ],
  providers: [TaskService, RecipeCheckService, DeviceCheckService],
  exports: [DeviceCheckService],
})
export class TaskModule {}
