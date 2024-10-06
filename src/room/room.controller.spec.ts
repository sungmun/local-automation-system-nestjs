import { Test, TestingModule } from '@nestjs/testing';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';
import { DeviceControlService } from '../device-control/device-control.service';
import { DataBaseDeviceService } from '../device/database-device.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';

describe('RoomController', () => {
  let controller: RoomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomController],
      providers: [
        RoomService,
        {
          provide: HejhomeApiService,
          useValue: {},
        },
        {
          provide: DeviceControlService,
          useValue: {},
        },
        {
          provide: DataBaseDeviceService,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Room),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<RoomController>(RoomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
