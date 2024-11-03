import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { HejhomeMessageQueueService } from '../hejhome-message-queue/hejhome-message-queue.service';
import { DataBaseDeviceService } from '../device/database-device.service';
import { DeviceStateService } from '../device-state/device-state.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Device } from '../device/entities/device.entity';
import { ResponseDeviceState } from '../hejhome-api/hejhome-api.interface';

describe('TaskService', () => {
  let service: TaskService;
  let hejhomeMessageQueueService: HejhomeMessageQueueService;
  let databaseDeviceService: DataBaseDeviceService;
  let deviceStateService: DeviceStateService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: HejhomeMessageQueueService,
          useValue: { isConnected: jest.fn() },
        },
        {
          provide: DataBaseDeviceService,
          useValue: { findAll: jest.fn() },
        },
        {
          provide: DeviceStateService,
          useValue: { getDeviceState: jest.fn() },
        },
        {
          provide: EventEmitter2,
          useValue: { emit: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    hejhomeMessageQueueService = module.get<HejhomeMessageQueueService>(
      HejhomeMessageQueueService,
    );
    databaseDeviceService = module.get<DataBaseDeviceService>(
      DataBaseDeviceService,
    );
    deviceStateService = module.get<DeviceStateService>(DeviceStateService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    jest.spyOn(service['logger'], 'log').mockImplementation(() => {});
    jest.spyOn(service['logger'], 'debug').mockImplementation(() => {});
    jest.spyOn(service['logger'], 'fatal').mockImplementation(() => {});
  });

  it('서비스가 정의되어야 한다', () => {
    expect(service).toBeDefined();
  });
  describe('checkDevicesEvery30Seconds', () => {
    it('MQ가 연결되어 있으면 cron 동작을 하지 않아야 한다', async () => {
      jest
        .spyOn(hejhomeMessageQueueService, 'isConnected')
        .mockReturnValue(true);
      const logSpy = jest.spyOn(service['logger'], 'log');

      await service.checkDevicesEvery30Seconds();

      expect(logSpy).toHaveBeenCalledWith('MQ is connected and not api check');
      expect(databaseDeviceService.findAll).not.toHaveBeenCalled();
    });

    it('MQ가 연결되어 있지 않으면 cron 동작을 해야 한다', async () => {
      jest
        .spyOn(hejhomeMessageQueueService, 'isConnected')
        .mockReturnValue(false);
      const hejhomeAPICheckSpy = jest
        .spyOn(service, 'hejhomeAPICheck')
        .mockImplementation(jest.fn());

      await service.checkDevicesEvery30Seconds();

      expect(hejhomeAPICheckSpy).toHaveBeenCalled();
    });
  });
  describe('hejhomeAPICheck', () => {
    beforeEach(() => {
      const devices: Device[] = [
        {
          id: '1',
          name: 'Device1',
          deviceType: 'type1',
          modelName: 'Model1',
          familyId: 'Family1',
          category: 'Category1',
          online: true,
          hasSubDevices: false,
          active: true,
          state: '{}',
          activeMessageTemplate: false,
        },
      ];
      jest.spyOn(databaseDeviceService, 'findAll').mockResolvedValue(devices);
    });
    it('hejhomeAPICheck 시 모든 장치 상태를 가져와야 한다', async () => {
      const mockDeviceState: ResponseDeviceState = {
        id: '1',
        deviceType: 'type1',
        deviceState: {},
      };
      jest
        .spyOn(deviceStateService, 'getDeviceState')
        .mockResolvedValue(mockDeviceState);
      const emitSpy = jest.spyOn(eventEmitter, 'emit');

      await service.hejhomeAPICheck();

      expect(databaseDeviceService.findAll).toHaveBeenCalled();
      expect(deviceStateService.getDeviceState).toHaveBeenCalledWith(
        '1',
        'type1',
      );
      expect(emitSpy).toHaveBeenCalledWith('set.type1.1', mockDeviceState);
    });

    it('장치 상태를 가져오는데 실패하면 로그를 찍어야 한다', async () => {
      jest
        .spyOn(deviceStateService, 'getDeviceState')
        .mockRejectedValue(new Error('test'));
      const logSpy = jest.spyOn(service['logger'], 'error').mockReturnValue();

      await service.hejhomeAPICheck();

      expect(logSpy).toHaveBeenCalledWith('[1] - type1 : test');
    });
  });
});
