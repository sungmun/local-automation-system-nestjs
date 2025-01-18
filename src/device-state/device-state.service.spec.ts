import { Test, TestingModule } from '@nestjs/testing';
import { DeviceStateService } from './device-state.service';
import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';
import { DataBaseDeviceService } from '../device/database-device.service';
import {
  ResponseDeviceState,
  ResponseIrAirconditionerState,
  ResponseSensorTHState,
} from '../hejhome-api/hejhome-api.interface';
import { Device } from '../device/entities/device.entity';

describe('DeviceStateService', () => {
  let service: DeviceStateService;
  let hejhomeApiService: HejhomeApiService;
  let databaseDeviceService: DataBaseDeviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceStateService,
        {
          provide: HejhomeApiService,
          useValue: {
            getDeviceRawState: jest.fn(),
            getDeviceState: jest.fn(),
            getDeviceStateAll: jest.fn(),
          },
        },
        {
          provide: DataBaseDeviceService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DeviceStateService>(DeviceStateService);
    hejhomeApiService = module.get<HejhomeApiService>(HejhomeApiService);
    databaseDeviceService = module.get<DataBaseDeviceService>(
      DataBaseDeviceService,
    );
  });

  describe('getDeviceState', () => {
    it('SensorTh 타입의 장치 상태를 가져와야 한다', async () => {
      const deviceId = '123';
      const deviceType = 'SensorTh';
      const expectedState: ResponseSensorTHState = {
        id: deviceId,
        deviceType: 'SensorTh',
        deviceState: {
          temperature: 25,
          humidity: 50,
          battery: 80,
        },
      };

      jest
        .spyOn(hejhomeApiService, 'getDeviceRawState')
        .mockResolvedValue(expectedState);

      const result = await service.getDeviceState(deviceId, deviceType);

      expect(result).toEqual(expectedState);
      expect(hejhomeApiService.getDeviceRawState).toHaveBeenCalledWith(
        deviceId,
      );
    });

    it('일반 장치 상태를 가져와야 한다', async () => {
      const deviceId = '123';
      const deviceType = 'IrAirconditioner';
      const expectedState: ResponseIrAirconditionerState = {
        id: deviceId,
        deviceType: 'IrAirconditioner',
        deviceState: {
          power: '켜짐',
          temperature: '24',
          mode: 1,
          fanSpeed: 3,
        },
      };

      jest
        .spyOn(hejhomeApiService, 'getDeviceState')
        .mockResolvedValue(expectedState);

      const result = await service.getDeviceState(deviceId, deviceType);

      expect(result).toEqual(expectedState);
      expect(hejhomeApiService.getDeviceState).toHaveBeenCalledWith(deviceId);
    });
  });

  describe('hasChanged', () => {
    it('장치 상태가 변경되었는지 확인해야 한다', async () => {
      const deviceId = '123';
      const state: ResponseDeviceState = {
        id: deviceId,
        deviceType: 'IrAirconditioner',
        deviceState: {
          power: '꺼짐',
          temperature: '22',
          mode: 2,
          fanSpeed: 2,
        },
      };
      const existingDevice = {
        state: JSON.stringify({
          power: '켜짐',
          temperature: '24',
          mode: 1,
          fanSpeed: 3,
        }),
      } as Device;

      jest
        .spyOn(databaseDeviceService, 'findOne')
        .mockResolvedValue(existingDevice);

      const result = await service.hasChanged(deviceId, state);

      expect(result).toBe(true);
      expect(databaseDeviceService.findOne).toHaveBeenCalledWith(deviceId);
    });

    it('장치 상태가 변경되지 않았는지 확인해야 한다', async () => {
      const deviceId = '123';
      const state: ResponseDeviceState = {
        id: deviceId,
        deviceType: 'IrAirconditioner',
        deviceState: {
          power: '켜짐',
          temperature: '24',
          mode: 1,
          fanSpeed: 3,
        },
      };
      const existingDevice = {
        state: JSON.stringify(state.deviceState),
      } as Device;

      jest
        .spyOn(databaseDeviceService, 'findOne')
        .mockResolvedValue(existingDevice);

      const result = await service.hasChanged(deviceId, state);

      expect(result).toBe(false);
      expect(databaseDeviceService.findOne).toHaveBeenCalledWith(deviceId);
    });
  });

  describe('getDeviceStateAll', () => {
    beforeEach(() => {
      jest.spyOn(service['logger'], 'error').mockImplementation(() => {});
    });

    it('모든 장치의 상태를 가져와야 한다', async () => {
      const mockDeviceStates: ResponseDeviceState[] = [
        {
          id: 'device-1',
          deviceType: 'SensorTh',
          deviceState: {
            temperature: 22,
            humidity: 50,
            battery: 80,
          },
        },
        {
          id: 'device-2',
          deviceType: 'IrAirconditioner',
          deviceState: {
            power: '켜짐',
            temperature: '24',
            mode: 1,
            fanSpeed: 2,
          },
        },
      ];

      jest
        .spyOn(hejhomeApiService, 'getDeviceStateAll')
        .mockResolvedValue(mockDeviceStates);

      const result = await service.getDeviceStateAll();

      expect(result).toEqual(mockDeviceStates);
      expect(hejhomeApiService.getDeviceStateAll).toHaveBeenCalled();
    });

    it('에러 메시지가 있는 경우 undefined를 반환하고 로그를 기록해야 한다', async () => {
      const errorResponse = { message: '장치 상태 조회 실패' };
      jest
        .spyOn(hejhomeApiService, 'getDeviceStateAll')
        .mockResolvedValue(errorResponse);

      const result = await service.getDeviceStateAll();

      expect(result).toBeUndefined();
      expect(service['logger'].error).toHaveBeenCalledWith(
        `장치 상태 조회 실패: ${errorResponse.message}`,
      );
    });
  });
});
