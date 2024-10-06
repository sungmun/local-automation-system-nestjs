import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { CloudDeviceService } from './cloud-device.service';
import { DataBaseDeviceService } from './database-device.service';
import { HejhomeApiModule } from '../hejhome-api/hejhome-api.module';

@Module({
  imports: [TypeOrmModule.forFeature([Device]), HejhomeApiModule],
  controllers: [DeviceController],
  providers: [DataBaseDeviceService, CloudDeviceService],
  exports: [DataBaseDeviceService, CloudDeviceService],
})
export class DeviceModule {}
