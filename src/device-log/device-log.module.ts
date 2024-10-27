import { Module } from '@nestjs/common';
import { DeviceLogService } from './device-log.service';
import { DeviceLogController } from './device-log.controller';

@Module({
  controllers: [DeviceLogController],
  providers: [DeviceLogService],
})
export class DeviceLogModule {}
