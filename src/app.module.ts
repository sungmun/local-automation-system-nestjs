import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InitService } from './init/init.service';
import { InitModule } from './init/init.module';
import { TaskModule } from './task/task.module';
import { DeviceStatusModule } from './device-status/device-status.module';
import { DeviceControlModule } from './device-control/device-control.module';
import { RoomModule } from './room/room.module';
import { DeviceModule } from './device/device.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { HejhomeApiModule } from './hejhome-api/hejhome-api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역 모듈로 설정
    }),
    InitModule,
    TaskModule,
    DeviceStatusModule,
    DeviceControlModule,
    RoomModule,
    DeviceModule,
    AuthModule,
    HejhomeApiModule,
  ],
  controllers: [AppController],
  providers: [AppService, InitService],
})
export class AppModule {}
