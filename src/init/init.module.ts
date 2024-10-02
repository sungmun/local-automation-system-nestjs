import { Module } from '@nestjs/common';
import { InitService } from './init.service';
import { AuthModule } from '../auth/auth.module';
import { DeviceModule } from '../device/device.module';
import { TaskModule } from 'src/task/task.module';

import { RoomModule } from 'src/room/room.module';

@Module({
  imports: [AuthModule, RoomModule, DeviceModule, TaskModule],
  providers: [InitService],
})
export class InitModule {}
