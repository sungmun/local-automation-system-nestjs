import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { CloudDeviceService } from './cloud-device.service';
import { DataBaseDeviceService } from './database-device.service';
import { HejhomeApiModule } from '../hejhome-api/hejhome-api.module';
import { MessageTemplateModule } from '../message-template/message-template.module';
import { DeviceSubscriber } from './entities/device.entity.subscriber';
import { PushMessagingModule } from '../push-messaging/push-messaging.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Device]),
    HejhomeApiModule,
    MessageTemplateModule,
    PushMessagingModule,
  ],
  controllers: [DeviceController],
  providers: [DataBaseDeviceService, CloudDeviceService, DeviceSubscriber],
  exports: [DataBaseDeviceService, CloudDeviceService],
})
export class DeviceModule {}
