import { Module } from '@nestjs/common';
import { DeviceLogService } from './device-log.service';
import { DeviceLogController } from './device-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceLog } from './entities/device-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceLog])],
  controllers: [DeviceLogController],
  providers: [DeviceLogService],
  exports: [DeviceLogService],
})
export class DeviceLogModule {}
