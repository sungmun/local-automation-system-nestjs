import { Test, TestingModule } from '@nestjs/testing';
import { InitService } from './init.service';
import { AuthService } from '../auth/auth.service';
import { CloudDeviceService } from '../device/cloud-device.service';
import { DataBaseDeviceService } from '../device/database-device.service';
import { TaskService } from '../task/task.service';
import { RoomService } from '../room/room.service';

describe('InitService', () => {
  let service: InitService;
  let authService: AuthService;
  let cloudDeviceService: CloudDeviceService;
  let databaseDeviceService: DataBaseDeviceService;
  let taskService: TaskService;
  let roomService: RoomService;

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
          provide: TaskService,
          useValue: { hejhomeAPICheck: jest.fn() },
        },
        {
          provide: RoomService,
          useValue: {
            getHomesWithRooms: jest.fn(),
            initRooms: jest.fn(),
            matchRoomWithSensor: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<InitService>(InitService);
    authService = module.get<AuthService>(AuthService);
    cloudDeviceService = module.get<CloudDeviceService>(CloudDeviceService);
    databaseDeviceService = module.get<DataBaseDeviceService>(
      DataBaseDeviceService,
    );
    taskService = module.get<TaskService>(TaskService);
    roomService = module.get<RoomService>(RoomService);
  });

  describe('onModuleInit', () => {
    beforeEach(() => {
      jest.spyOn(roomService, 'getHomesWithRooms').mockResolvedValue([]);
    });

    it('로그 메시지를 출력해야 한다', async () => {
      const logSpy = jest.spyOn(service['logger'], 'log');
      await service.onModuleInit();
      expect(logSpy).toHaveBeenCalledWith('onModuleInit start');
      expect(logSpy).toHaveBeenCalledWith('onModuleInit success');
      expect(logSpy).toHaveBeenCalledWith('onModuleInit api check');
    });

    it('새로운 토큰을 설정해야 한다', async () => {
      await service.onModuleInit();
      expect(authService.setRefreshToken).toHaveBeenCalled();
    });

    it('방을 초기화해야 한다', async () => {
      const rooms = [{ room_id: 1, name: 'Room 1', homeId: 1 }];
      jest.spyOn(roomService, 'getHomesWithRooms').mockResolvedValue(rooms);
      await service.onModuleInit();
      expect(roomService.initRooms).toHaveBeenCalledWith(
        rooms.map((room) => ({ ...room, id: room.room_id })),
      );
    });

    it('장치를 초기화해야 한다', async () => {
      const rooms = [{ room_id: 1, name: 'Room 1', homeId: 1 }];
      const devicesWithRoomId = [
        {
          id: 'device1',
          name: 'Device 1',
          deviceType: 'SensorTh',
          hasSubDevices: false,
          modelName: 'Model 1',
          familyId: 'Family 1',
          category: 'Category 1',
          online: true,
          roomId: 1,
        },
      ];
      const devices = [
        {
          id: 'device2',
          name: 'Device 2',
          deviceType: 'SensorTh',
          hasSubDevices: false,
          modelName: 'Model 2',
          familyId: 'Family 2',
          category: 'Category 2',
          online: true,
        },
      ];
      jest.spyOn(roomService, 'getHomesWithRooms').mockResolvedValue(rooms);
      jest
        .spyOn(cloudDeviceService, 'getDevicesWithRoomId')
        .mockResolvedValue(devicesWithRoomId);
      jest.spyOn(cloudDeviceService, 'getDevices').mockResolvedValue(devices);
      jest
        .spyOn(cloudDeviceService, 'getUniqueDevices')
        .mockResolvedValue(devices);
      await service.onModuleInit();
      expect(databaseDeviceService.bulkInsert).toHaveBeenCalledWith(devices);
    });

    it('방과 센서를 매칭해야 한다', async () => {
      const rooms = [{ room_id: 1, name: 'Room 1', homeId: 1 }];
      jest.spyOn(roomService, 'getHomesWithRooms').mockResolvedValue(rooms);
      await service.onModuleInit();
      expect(roomService.matchRoomWithSensor).toHaveBeenCalledWith(1);
    });

    it('API 체크를 수행해야 한다', async () => {
      await service.onModuleInit();
      expect(taskService.hejhomeAPICheck).toHaveBeenCalled();
    });
  });
});
