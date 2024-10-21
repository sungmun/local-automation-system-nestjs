import { Test, TestingModule } from '@nestjs/testing';
import { DeviceStateController } from './device-state.controller';
import { DeviceStateService } from './device-state.service';
import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';
import { DataBaseDeviceService } from '../device/database-device.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ResponseDeviceState } from '../hejhome-api/hejhome-api.interface';

describe('DeviceStateController', () => {
  let controller: DeviceStateController;
  let deviceStateService: DeviceStateService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceStateController],
      providers: [
        DeviceStateService,
        {
          provide: HejhomeApiService,
          useValue: {},
        },
        {
          provide: DataBaseDeviceService,
          useValue: {},
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DeviceStateController>(DeviceStateController);
    deviceStateService = module.get<DeviceStateService>(DeviceStateService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('컨트롤러가 정의되어야 한다', () => {
    expect(controller).toBeDefined();
  });

  describe('hasChangedDevice', () => {
    it('장치 상태가 변경되었을 때 이벤트를 발생시켜야 한다', async () => {
      const state: ResponseDeviceState = {
        id: '1',
        deviceType: 'IrAirconditioner',
        deviceState: {},
      };
      jest.spyOn(deviceStateService, 'hasChanged').mockResolvedValue(true);

      await controller.hasChangedDevice(state);

      expect(eventEmitter.emit).toHaveBeenCalledWith(
        `changed.${state.deviceType}.${state.id}`,
        state,
      );
    });

    it('장치 상태가 변경되지 않았을 때 이벤트를 발생시키지 않아야 한다', async () => {
      const state: ResponseDeviceState = {
        id: '1',
        deviceType: 'IrAirconditioner',
        deviceState: {},
      };
      jest.spyOn(deviceStateService, 'hasChanged').mockResolvedValue(false);

      await controller.hasChangedDevice(state);

      expect(eventEmitter.emit).not.toHaveBeenCalledWith(
        `changed.${state.deviceType}.${state.id}`,
        state,
      );
    });
  });

  describe('changeDeviceEvent', () => {
    it('장치 변경 이벤트가 발생했을 때 완료 이벤트를 발생시켜야 한다', async () => {
      const state: ResponseDeviceState = {
        id: '1',
        deviceType: 'IrAirconditioner',
        deviceState: {},
      };

      await controller.changeDeviceEvent(state);

      expect(eventEmitter.emit).toHaveBeenCalledWith(
        `finish.${state.deviceType}.${state.id}`,
        state,
      );
    });
  });
});
