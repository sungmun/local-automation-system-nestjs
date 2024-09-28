import { Test, TestingModule } from '@nestjs/testing';
import { DeviceControlService } from './device-control.service';

describe('DeviceControlService', () => {
  let service: DeviceControlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceControlService],
    }).compile();

    service = module.get<DeviceControlService>(DeviceControlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
