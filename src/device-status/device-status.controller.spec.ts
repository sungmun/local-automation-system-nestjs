import { Test, TestingModule } from '@nestjs/testing';
import { DeviceStatusController } from './device-status.controller';
import { DeviceStatusService } from './device-status.service';

describe('DeviceStatusController', () => {
  let controller: DeviceStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceStatusController],
      providers: [DeviceStatusService],
    }).compile();

    controller = module.get<DeviceStatusController>(DeviceStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
