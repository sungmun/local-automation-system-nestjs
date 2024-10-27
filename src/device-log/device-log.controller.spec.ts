import { Test, TestingModule } from '@nestjs/testing';
import { DeviceLogController } from './device-log.controller';
import { DeviceLogService } from './device-log.service';

describe('DeviceLogController', () => {
  let controller: DeviceLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceLogController],
      providers: [DeviceLogService],
    }).compile();

    controller = module.get<DeviceLogController>(DeviceLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
