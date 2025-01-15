import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DeviceCheckService } from './device-check.service';
import { DeviceStateService } from '../device-state/device-state.service';
import { ResponseDeviceState } from '../hejhome-api/hejhome-api.interface';

describe('DeviceCheckService', () => {
  let service: DeviceCheckService;
  let deviceStateService: jest.Mocked<DeviceStateService>;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceCheckService,
        {
          provide: DeviceStateService,
          useValue: {
            getDeviceStateAll: jest.fn(),
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

    deviceStateService = module.get(DeviceStateService);
    eventEmitter = module.get(EventEmitter2);
  });

  it('서비스가 정의되어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('checkDevices', () => {
    it('모든 장치의 상태를 확인하고 이벤트를 발생시켜야 합니다', async () => {
      const mockState: ResponseDeviceState[] = [
        {
          id: 'device1',
          deviceType: 'SensorTh',
          deviceState: {
            temperature: 25,
            humidity: 60,
          },
        },
        {
          id: 'device2',
          deviceType: 'SensorTh',
          deviceState: {
            temperature: 25,
            humidity: 70,
          },
        },
      ];

      deviceStateService.getDeviceStateAll.mockResolvedValue(mockState);

      await service.checkDevices();

      expect(deviceStateService.getDeviceStateAll).toHaveBeenCalledTimes(1);
      expect(eventEmitter.emit).toHaveBeenCalledTimes(2);
    });
  });
});
