import { Test, TestingModule } from '@nestjs/testing';
import { DeviceStatusService } from './device-status.service';

describe('DeviceStatusService', () => {
  let service: DeviceStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceStatusService],
    }).compile();

    service = module.get<DeviceStatusService>(DeviceStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
