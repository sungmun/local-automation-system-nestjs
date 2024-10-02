import { Test, TestingModule } from '@nestjs/testing';
import { DeviceStateService } from './device-state.service';

describe('DeviceStateService', () => {
  let service: DeviceStateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceStateService],
    }).compile();

    service = module.get<DeviceStateService>(DeviceStateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
