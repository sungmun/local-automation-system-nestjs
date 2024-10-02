import { Module } from '@nestjs/common';
import { DeviceControlService } from './device-control.service';
import { DeviceControlController } from './device-control.controller';
import { HejhomeApiModule } from 'src/hejhome-api/hejhome-api.module';

@Module({
  imports: [HejhomeApiModule],
  controllers: [DeviceControlController],
  providers: [DeviceControlService],
  exports: [DeviceControlService],
})
export class DeviceControlModule {}
