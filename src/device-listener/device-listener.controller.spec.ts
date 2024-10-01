import { Test, TestingModule } from '@nestjs/testing';
import { DeviceListenerController } from './device-listener.controller';
import { DeviceListenerService } from './device-listener.service';

describe('DeviceListenerController', () => {
  let controller: DeviceListenerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceListenerController],
      providers: [DeviceListenerService],
    }).compile();

    controller = module.get<DeviceListenerController>(DeviceListenerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
