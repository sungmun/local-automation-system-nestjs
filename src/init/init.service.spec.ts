import { Test, TestingModule } from '@nestjs/testing';
import { InitService } from './init.service';
import { AuthService } from '../auth/auth.service';
import { CloudDeviceService } from '../device/cloud-device.service';
import { DataBaseDeviceService } from '../device/database-device.service';
import { RoomService } from '../room/room.service';
import { TaskService } from '../task/task.service';

describe('InitService', () => {
  let service: InitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InitService,
        {
          provide: AuthService,
          useValue: {},
        },
        {
          provide: CloudDeviceService,
          useValue: {},
        },
        {
          provide: DataBaseDeviceService,
          useValue: {},
        },
        {
          provide: RoomService,
          useValue: {},
        },
        {
          provide: TaskService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<InitService>(InitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
