import { Test, TestingModule } from '@nestjs/testing';
import { DeviceHandler } from './device.handler';
import { DataBaseDeviceService } from './database-device.service';
import { ResponseDeviceState } from '../hejhome-api/hejhome-api.interface';

describe('DeviceHandler', () => {
  let handler: DeviceHandler;
  let databaseDeviceService: jest.Mocked<DataBaseDeviceService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceHandler,
        {
          provide: DataBaseDeviceService,
          useValue: {
            updateState: jest.fn().mockResolvedValue(undefined),
            changedDeviceSendMessage: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    handler = module.get<DeviceHandler>(DeviceHandler);
    databaseDeviceService = module.get(DataBaseDeviceService);
  });

  describe('changedDeviceSendMessage', () => {
    it('장치 상태가 변경되었을 때 메시지를 전송해야 한다', async () => {
      const state: ResponseDeviceState = {
        id: 'device1',
        deviceType: 'IrAirconditioner',
        deviceState: {
          power: '켜짐',
          temperature: '24',
          mode: 1,
          fanSpeed: 2,
        },
      };

      await handler.changedDeviceSendMessage(state);
      expect(databaseDeviceService.updateState).toHaveBeenCalledWith(
        state.id,
        state.deviceState,
      );
      expect(
        databaseDeviceService.changedDeviceSendMessage,
      ).toHaveBeenCalledWith(state);
    });
  });
});
