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

  it('MQ가 연결되어 있으면 API 체크를 하지 않아야 한다', async () => {
    jest.spyOn(hejhomeMessageQueueService, 'isConnected').mockReturnValue(true);
    const logSpy = jest.spyOn(service['logger'], 'log');

    await service.hejhomeAPICheck();

    expect(logSpy).toHaveBeenCalledWith('MQ is connected and not api check');
  });

  it('MQ가 연결되어 있지 않으면 모든 장치 상태를 가져와야 한다', async () => {
    jest
      .spyOn(hejhomeMessageQueueService, 'isConnected')
      .mockReturnValue(false);

    // Device 타입에 필요한 모든 필드를 포함하도록 수정
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
        state: '{}',
      },
    ];
    jest.spyOn(databaseDeviceService, 'findAll').mockResolvedValue(devices);

    // 적절한 타입의 값을 반환하도록 수정
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

    expect(deviceStateService.getDeviceState).toHaveBeenCalledWith(
      '1',
      'type1',
    );
    expect(emitSpy).toHaveBeenCalledWith('set.type1.1', mockDeviceState);
  });
});
