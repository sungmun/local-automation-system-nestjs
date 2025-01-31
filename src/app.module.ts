import { Module } from '@nestjs/common';
import { InitModule } from './init/init.module';
import { TaskModule } from './task/task.module';
import { DeviceControlModule } from './device-control/device-control.module';
import { RoomModule } from './room/room.module';
import { DeviceModule } from './device/device.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { HejhomeApiModule } from './hejhome-api/hejhome-api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HejhomeMessageQueueModule } from './hejhome-message-queue/hejhome-message-queue.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DeviceStateModule } from './device-state/device-state.module';
import { TimerManagerModule } from './timer-manager/timer-manager.module';
import { MessageTemplateModule } from './message-template/message-template.module';
import { PushMessagingModule } from './push-messaging/push-messaging.module';
import { DeviceSubscriber } from './device/entities/device.entity.subscriber';
import { LogModule } from './log/log.module';
import { RecipeModule } from './recipe/recipe.module';
import { RecipeCommandModule } from './recipe-command/recipe-command.module';
import { RecipeConditionModule } from './recipe-condition/recipe-condition.module';

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
      logging: process.env.NODE_ENV !== 'production',
      subscribers: [DeviceSubscriber],
    }),
    ...(process.env.NODE_ENV !== 'test' ? [ScheduleModule.forRoot()] : []),
    InitModule,
    TaskModule,
    DeviceControlModule,
    RoomModule,
    DeviceModule,
    AuthModule,
    HejhomeApiModule,
    HejhomeMessageQueueModule,
    DeviceStateModule,
    TimerManagerModule,
    MessageTemplateModule,
    PushMessagingModule,
    LogModule,
    RecipeModule,
    RecipeCommandModule,
    RecipeConditionModule,
  ],
})
export class AppModule {}
