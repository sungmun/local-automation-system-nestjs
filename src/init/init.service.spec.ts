import { Test, TestingModule } from '@nestjs/testing';
import { InitService } from './init.service';
import { AuthService } from '../auth/auth.service';
import { CloudDeviceService } from '../device/cloud-device.service';
import { DataBaseDeviceService } from '../device/database-device.service';
import { HejHomeRoomService } from '../room/hej-home-room.service';
import { RoomService } from '../room/room.service';
import { RoomSensorService } from '../room/room-sensor.service';
import { DeviceCheckService } from '../task/device-check.service';
import { Logger } from '@nestjs/common';
import { RoomWithDeviceDto } from '../device/dto/room-with-device.dto';
import { plainToInstance } from 'class-transformer';
import { DeviceDto } from '../device/dto/device.dto';

describe('InitService', () => {
  let service: InitService;
  let authService: jest.Mocked<AuthService>;
  let cloudDeviceService: jest.Mocked<CloudDeviceService>;
  let databaseDeviceService: jest.Mocked<DataBaseDeviceService>;
  let hejHomeRoomService: jest.Mocked<HejHomeRoomService>;
  let roomService: jest.Mocked<RoomService>;
  let roomSensorService: jest.Mocked<RoomSensorService>;
  let deviceCheckService: jest.Mocked<DeviceCheckService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InitService,
        {
          provide: AuthService,
          useValue: {
            setRefreshToken: jest.fn(),
          },
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
          useValue: {
            bulkInsert: jest.fn(),
          },
        },
        {
          provide: HejHomeRoomService,
          useValue: {
            getHomesWithRooms: jest.fn(),
          },
        },
        {
          provide: RoomService,
          useValue: {
            initRooms: jest.fn(),
          },
        },
        {
          provide: RoomSensorService,
          useValue: {
            matchRoomWithSensor: jest.fn(),
          },
        },
        {
          provide: DeviceCheckService,
          useValue: {
            checkDevices: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<InitService>(InitService);
    authService = module.get(AuthService);
    cloudDeviceService = module.get(CloudDeviceService);
    databaseDeviceService = module.get(DataBaseDeviceService);
    hejHomeRoomService = module.get(HejHomeRoomService);
    roomService = module.get(RoomService);
    roomSensorService = module.get(RoomSensorService);
    deviceCheckService = module.get(DeviceCheckService);
  });

  describe('초기화 프로세스', () => {
    it('모든 초기화 단계가 순서대로 실행되어야 한다', async () => {
      const mockRooms = [{ room_id: 1, name: '거실', homeId: 1 }];
      const mockDevices = [
        {
          id: 'device1',
          name: '장치1',
          deviceType: 'SensorTh',
          hasSubDevices: false,
          modelName: 'Model1',
          familyId: 'Family1',
          category: 'Category1',
          online: true,
          platform: 'hejhome',
        },
      ];

      hejHomeRoomService.getHomesWithRooms.mockResolvedValue(mockRooms);
      cloudDeviceService.getDevicesWithRoomId.mockResolvedValue([
        new RoomWithDeviceDto(mockDevices[0], mockRooms[0].room_id),
      ]);
      cloudDeviceService.getDevices.mockResolvedValue(
        plainToInstance(DeviceDto, mockDevices),
      );
      cloudDeviceService.getUniqueDevices.mockResolvedValue(mockDevices);

      const logSpy = jest.spyOn(Logger.prototype, 'log');

      await service.onModuleInit();

      expect(logSpy).toHaveBeenNthCalledWith(1, 'onModuleInit start');
      expect(authService.setRefreshToken).toHaveBeenCalled();
      expect(hejHomeRoomService.getHomesWithRooms).toHaveBeenCalled();
      expect(roomService.initRooms).toHaveBeenCalledWith([
        { ...mockRooms[0], id: mockRooms[0].room_id },
      ]);
      expect(cloudDeviceService.getDevicesWithRoomId).toHaveBeenCalledWith(
        mockRooms,
      );
      expect(cloudDeviceService.getDevices).toHaveBeenCalled();
      expect(cloudDeviceService.getUniqueDevices).toHaveBeenCalled();
      expect(databaseDeviceService.bulkInsert).toHaveBeenCalledWith(
        mockDevices,
      );
      expect(roomSensorService.matchRoomWithSensor).toHaveBeenCalledWith(1);
      expect(deviceCheckService.checkDevices).toHaveBeenCalled();
      expect(logSpy).toHaveBeenNthCalledWith(2, 'onModuleInit success');
      expect(logSpy).toHaveBeenNthCalledWith(3, 'onModuleInit api check');
    });

    it('초기화 중 오류가 발생하면 예외를 던져야 한다', async () => {
      const error = new Error('초기화 실패');
      hejHomeRoomService.getHomesWithRooms.mockRejectedValue(error);

      await expect(service.onModuleInit()).rejects.toThrow('초기화 실패');
    });
  });
});
