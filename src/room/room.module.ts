import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { HejhomeApiModule } from '../hejhome-api/hejhome-api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { DeviceControlModule } from '../device-control/device-control.module';
import { DeviceModule } from '../device/device.module';
import { RoomSensorService } from './room-sensor.service';
import { HejHomeRoomService } from './hej-home-room.service';
import { RoomCrudService } from './room-crud.service';

import { RecipeConditionModule } from '../recipe-condition/recipe-condition.module';

@Module({
  imports: [
    HejhomeApiModule,
    TypeOrmModule.forFeature([Room]),
    DeviceControlModule,
    DeviceModule,
    RecipeConditionModule,
  ],
  controllers: [RoomController],
  providers: [
    RoomService,
    RoomSensorService,
    HejHomeRoomService,
    RoomCrudService,
  ],
  exports: [
    RoomService,
    RoomCrudService,
    RoomSensorService,
    HejHomeRoomService,
  ],
})
export class RoomModule {}
