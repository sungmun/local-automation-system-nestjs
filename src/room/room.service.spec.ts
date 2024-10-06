import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './room.service';
import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';
import { DeviceControlService } from '../device-control/device-control.service';
import { DataBaseDeviceService } from '../device/database-device.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';

describe('RoomService', () => {
  let service: RoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<RoomService>(RoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
