import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InitModule } from './init/init.module';
import { TaskModule } from './task/task.module';
import { DeviceStatusModule } from './device-status/device-status.module';
import { DeviceControlModule } from './device-control/device-control.module';
import { RoomModule } from './room/room.module';
import { DeviceModule } from './device/device.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { HejhomeApiModule } from './hejhome-api/hejhome-api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HejhomeMessageQueueModule } from './hejhome-message-queue/hejhome-message-queue.module';
import { DeviceListenerModule } from './device-listener/device-listener.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역 모듈로 설정
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'sql_lite.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),

    TaskModule,
    DeviceStatusModule,
    DeviceControlModule,
    RoomModule,
    DeviceModule,
    AuthModule,
    HejhomeApiModule,
    InitModule,
    HejhomeMessageQueueModule,
    DeviceListenerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
