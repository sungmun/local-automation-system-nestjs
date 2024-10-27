import { Test, TestingModule } from '@nestjs/testing';
import { DeviceLogService } from './device-log.service';

describe('DeviceLogService', () => {
  let service: DeviceLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceLogService],
    }).compile();

    service = module.get<DeviceLogService>(DeviceLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
