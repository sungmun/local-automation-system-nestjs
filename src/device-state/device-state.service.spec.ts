import { Test, TestingModule } from '@nestjs/testing';
import { DeviceStateService } from './device-state.service';
import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';
import { DataBaseDeviceService } from '../device/database-device.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('DeviceStateService', () => {
  let service: DeviceStateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceStateService,
        {
          provide: HejhomeApiService,
          useValue: {},
        },
        {
          provide: DataBaseDeviceService,
          useValue: {},
        },
        {
          provide: EventEmitter2,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<DeviceStateService>(DeviceStateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
