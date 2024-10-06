import { Test, TestingModule } from '@nestjs/testing';
import { DeviceControlService } from './device-control.service';
import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';

describe('DeviceControlService', () => {
  let service: DeviceControlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceControlService,
        {
          provide: HejhomeApiService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<DeviceControlService>(DeviceControlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
