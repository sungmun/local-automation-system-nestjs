import { Test, TestingModule } from '@nestjs/testing';
import { DeviceLogController } from './device-log.controller';
import { DeviceLogService } from './device-log.service';
import { ResponseDeviceState } from '../hejhome-api/hejhome-api.interface';

describe('DeviceLogController', () => {
  let controller: DeviceLogController;
  let service: DeviceLogService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceLogController],
      providers: [
        {
          provide: DeviceLogService,
          useValue: {
            autoChangeLog: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DeviceLogController>(DeviceLogController);
    service = module.get<DeviceLogService>(DeviceLogService);
  });

  it('컨트롤러가 정의되어야 한다', () => {
    expect(controller).toBeDefined();
  });

  describe('autoLog', () => {
    it('autoLog 에서 autoChangeLog 를 호출해야 한다', async () => {
      const state = {} as ResponseDeviceState;
      await controller.autoLog(state);
      expect(service.autoChangeLog).toHaveBeenCalledWith(state);
    });
  });
});
