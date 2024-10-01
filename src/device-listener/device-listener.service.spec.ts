import { Test, TestingModule } from '@nestjs/testing';
import { DeviceListenerService } from './device-listener.service';

describe('DeviceListenerService', () => {
  let service: DeviceListenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceListenerService],
    }).compile();

    service = module.get<DeviceListenerService>(DeviceListenerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
