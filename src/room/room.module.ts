import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { HejhomeApiModule } from '../hejhome-api/hejhome-api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { DeviceControlModule } from '../device-control/device-control.module';
import { DeviceModule } from '../device/device.module';

@Module({
  imports: [
    HejhomeApiModule,
    TypeOrmModule.forFeature([Room]),
    DeviceControlModule,
    DeviceModule,
  ],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
