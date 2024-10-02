import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { HejhomeApiModule } from 'src/hejhome-api/hejhome-api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { DeviceControlModule } from 'src/device-control/device-control.module';

@Module({
  imports: [
    HejhomeApiModule,
    TypeOrmModule.forFeature([Room]),
    DeviceControlModule,
  ],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
