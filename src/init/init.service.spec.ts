import { Test, TestingModule } from '@nestjs/testing';
import { InitService } from './init.service';
import { AuthService } from '../auth/auth.service';
import { CloudDeviceService } from '../device/cloud-device.service';
import { DataBaseDeviceService } from '../device/database-device.service';
import { RoomService } from '../room/room.service';
import { TaskService } from '../task/task.service';

describe('InitService', () => {
  let service: InitService;
  let authService: AuthService;
  let cloudDeviceService: CloudDeviceService;
  let databaseDeviceService: DataBaseDeviceService;
  let roomService: RoomService;
  let taskService: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InitService,
        {
          provide: AuthService,
          useValue: { setRefreshToken: jest.fn() },
        },
        {
          provide: CloudDeviceService,
          useValue: {
            getDevicesWithRoomId: jest.fn(),
            getDevices: jest.fn(),
            getUniqueDevices: jest.fn(),
          },
        },
        {
          provide: DataBaseDeviceService,
          useValue: { bulkInsert: jest.fn() },
        },
        {
          provide: RoomService,
          useValue: {
            getHomesWithRooms: jest.fn(),
            initRooms: jest.fn(),
            matchRoomWithSensor: jest.fn(),
          },
        },
        {
          provide: TaskService,
          useValue: { hejhomeAPICheck: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<InitService>(InitService);
    authService = module.get<AuthService>(AuthService);
    cloudDeviceService = module.get<CloudDeviceService>(CloudDeviceService);
    databaseDeviceService = module.get<DataBaseDeviceService>(
      DataBaseDeviceService,
    );
    roomService = module.get<RoomService>(RoomService);
    taskService = module.get<TaskService>(TaskService);
    jest.spyOn(roomService, 'getHomesWithRooms').mockResolvedValue([]);
  });

  it('서비스가 정의되어야 한다', () => {
    expect(service).toBeDefined();
  });

  it('onModuleInit이 호출되면 로그가 출력되어야 한다', async () => {
    const logSpy = jest.spyOn(service['logger'], 'log');
    await service.onModuleInit();
    expect(logSpy).toHaveBeenCalledWith('onModuleInit start');
    expect(logSpy).toHaveBeenCalledWith('onModuleInit success');
    expect(logSpy).toHaveBeenCalledWith('onModuleInit api check');
  });

  it('onModuleInit이 호출되면 AuthService의 setRefreshToken이 호출되어야 한다', async () => {
    await service.onModuleInit();
    expect(authService.setRefreshToken).toHaveBeenCalled();
  });

  it('onModuleInit이 호출되면 RoomService의 initRooms가 호출되어야 한다', async () => {
    await service.onModuleInit();
    expect(roomService.initRooms).toHaveBeenCalled();
  });

  it('onModuleInit이 호출되면 CloudDeviceService의 getDevicesWithRoomId와 getDevices가 호출되어야 한다', async () => {
    await service.onModuleInit();
    expect(cloudDeviceService.getDevicesWithRoomId).toHaveBeenCalled();
    expect(cloudDeviceService.getDevices).toHaveBeenCalled();
  });

  it('onModuleInit이 호출되면 DataBaseDeviceService의 bulkInsert가 호출되어야 한다', async () => {
    await service.onModuleInit();
    expect(databaseDeviceService.bulkInsert).toHaveBeenCalled();
  });

  it('onModuleInit이 호출되면 TaskService의 hejhomeAPICheck가 호출되어야 한다', async () => {
    await service.onModuleInit();
    expect(taskService.hejhomeAPICheck).toHaveBeenCalled();
  });
});
