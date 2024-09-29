import { Module } from '@nestjs/common';
import { InitService } from './init.service';
import { AuthModule } from '../auth/auth.module';
import { DeviceStatusModule } from '../device-status/device-status.module';
import { DeviceModule } from '../device/device.module';

@Module({
  imports: [AuthModule, DeviceStatusModule, DeviceModule],
  providers: [InitService],
})
export class InitModule {}
