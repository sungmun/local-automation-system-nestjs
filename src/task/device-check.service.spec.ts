import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DeviceCheckService } from './device-check.service';
import { DataBaseDeviceService } from '../device/database-device.service';
import { DeviceStateService } from '../device-state/device-state.service';
import { Device } from '../device/entities/device.entity';
import { ResponseDeviceState } from '../hejhome-api/hejhome-api.interface';

describe('DeviceCheckService', () => {
  let service: DeviceCheckService;
  let databaseDeviceService: jest.Mocked<DataBaseDeviceService>;
  let deviceStateService: jest.Mocked<DeviceStateService>;
  let eventEmitter: jest.Mocked<EventEmitter2>;
  let loggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceCheckService,
        {
          provide: DataBaseDeviceService,
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: DeviceStateService,
          useValue: {
            getDeviceState: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DeviceCheckService>(DeviceCheckService);
    databaseDeviceService = module.get(DataBaseDeviceService);
    deviceStateService = module.get(DeviceStateService);
    eventEmitter = module.get(EventEmitter2);
    loggerSpy = jest.spyOn(service['logger'], 'error').mockImplementation();
  });

  describe('checkDevices', () => {
    it('모든 장치의 상태를 확인하고 이벤트를 발생시켜야 합니다', async () => {
      const mockDevices = [
        { id: 'device1', deviceType: 'SensorTh' },
        { id: 'device2', deviceType: 'IrAirconditioner' },
      ] as Device[];

      const mockState: ResponseDeviceState = {
        id: 'device1',
        deviceType: 'SensorTh',
        deviceState: {
          temperature: 25,
          humidity: 60,
        },
      };

      databaseDeviceService.findAll.mockResolvedValue(mockDevices);
      deviceStateService.getDeviceState.mockResolvedValue(mockState);

      await service.checkDevices();

      expect(databaseDeviceService.findAll).toHaveBeenCalled();
      expect(deviceStateService.getDeviceState).toHaveBeenCalledTimes(2);
      expect(eventEmitter.emit).toHaveBeenCalledTimes(2);
    });

    it('IrDiy 타입의 장치는 건너뛰어야 합니다', async () => {
      const mockDevices = [{ id: 'device1', deviceType: 'IrDiy' }] as Device[];

      databaseDeviceService.findAll.mockResolvedValue(mockDevices);

      await service.checkDevices();

      expect(deviceStateService.getDeviceState).not.toHaveBeenCalled();
      expect(eventEmitter.emit).not.toHaveBeenCalled();
    });

    it('장치 상태 조회 실패시 에러를 기록하고 계속 진행해야 합니다', async () => {
      const mockDevices = [
        { id: 'device1', deviceType: 'SensorTh' },
      ] as Device[];

      databaseDeviceService.findAll.mockResolvedValue(mockDevices);
      deviceStateService.getDeviceState.mockRejectedValue(
        new Error('상태 조회 실패'),
      );

      await service.checkDevices();

      expect(loggerSpy).toHaveBeenCalledWith(
        '장치 상태 조회 실패 [device1] - SensorTh: 상태 조회 실패',
      );
      expect(eventEmitter.emit).not.toHaveBeenCalled();
    });

    it('장치 처리 중 에러가 발생해도 다른 장치 처리를 계속해야 합니다', async () => {
      const mockDevices = [
        { id: 'device1', deviceType: 'SensorTh' },
        { id: 'device2', deviceType: 'IrAirconditioner' },
      ] as Device[];

      const mockState: ResponseDeviceState = {
        id: 'device2',
        deviceType: 'IrAirconditioner',
        deviceState: {
          power: '켜짐',
          temperature: '24',
        },
      };

      databaseDeviceService.findAll.mockResolvedValue(mockDevices);
      deviceStateService.getDeviceState
        .mockRejectedValueOnce(new Error('device1 에러'))
        .mockResolvedValueOnce(mockState);

      await service.checkDevices();

      expect(loggerSpy).toHaveBeenCalledWith(
        '장치 상태 조회 실패 [device1] - SensorTh: device1 에러',
      );
      expect(eventEmitter.emit).toHaveBeenCalledTimes(1);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        `set.${mockState.deviceType}.${mockState.id}`,
        mockState,
      );
    });
  });
});
