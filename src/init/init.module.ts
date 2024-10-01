import { Module } from '@nestjs/common';
import { InitService } from './init.service';
import { AuthModule } from '../auth/auth.module';
import { DeviceModule } from '../device/device.module';
import { TaskModule } from 'src/task/task.module';

@Module({
  imports: [AuthModule, DeviceModule, TaskModule],
  providers: [InitService],
})
export class InitModule {}
