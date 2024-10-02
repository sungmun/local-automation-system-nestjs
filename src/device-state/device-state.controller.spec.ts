import { Test, TestingModule } from '@nestjs/testing';
import { DeviceStateController } from './device-state.controller';
import { DeviceStateService } from './device-state.service';

describe('DeviceStateController', () => {
  let controller: DeviceStateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceStateController],
      providers: [DeviceStateService],
    }).compile();

    controller = module.get<DeviceStateController>(DeviceStateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
