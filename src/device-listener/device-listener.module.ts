import { Module } from '@nestjs/common';
import { DeviceListenerService } from './device-listener.service';
import { DeviceListenerController } from './device-listener.controller';

@Module({
  controllers: [DeviceListenerController],
  providers: [DeviceListenerService],
})
export class DeviceListenerModule {}
