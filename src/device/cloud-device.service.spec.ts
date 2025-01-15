import { Test, TestingModule } from '@nestjs/testing';
import { CloudDeviceService } from './cloud-device.service';
import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';
import {
  ResponseDevice,
  ResponseRoom,
} from '../hejhome-api/hejhome-api.interface';
import { DeviceDto } from './dto/device.dto';
import { RoomWithDeviceDto } from './dto/room-with-device.dto';

describe('CloudDeviceService', () => {
  let service: CloudDeviceService;
  let hejhomeApiService: HejhomeApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CloudDeviceService,
        {
          provide: HejhomeApiService,
          useValue: {
            getDevices: jest.fn(),
            getRoomWithDevices: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CloudDeviceService>(CloudDeviceService);
    hejhomeApiService = module.get<HejhomeApiService>(HejhomeApiService);
  });

  describe('getUniqueDevices', () => {
    it('중복되지 않은 장치 목록을 반환해야 한다', async () => {
      const devices: ResponseDevice[] = [
        {
          id: '1',
          name: 'Device1',
          deviceType: 'Type1',
          hasSubDevices: false,
          modelName: 'Model1',
          familyId: 'Family1',
          category: 'Category1',
          online: true,
        },
        {
          id: '1',
          name: 'Device1',
          deviceType: 'Type1',
          hasSubDevices: false,
          modelName: 'Model1',
          familyId: 'Family1',
          category: 'Category1',
          online: true,
        },
      ];
      const result = await service.getUniqueDevices(devices);
      expect(result).toHaveLength(1);
    });
  });

  describe('getDevices', () => {
    it('장치 목록을 반환해야 한다', async () => {
      const mockDevices: ResponseDevice[] = [
        {
          id: '1',
          name: 'Device1',
          deviceType: 'Type1',
          hasSubDevices: false,
          modelName: 'Model1',
          familyId: 'Family1',
          category: 'Category1',
          online: true,
        },
      ];

      jest
        .spyOn(hejhomeApiService, 'getDevices')
        .mockResolvedValue(mockDevices);

      const result = await service.getDevices();

      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toBeInstanceOf(DeviceDto);
      expect(result[0].platform).toBe('hejhome');
    });
  });

  describe('getDevicesWithRoomId', () => {
    it('방 ID가 포함된 장치 목록을 반환해야 한다', async () => {
      const roomsWithHomeId: (ResponseRoom & { homeId: number })[] = [
        { name: 'Room1', room_id: 1, homeId: 1 },
      ];

      const mockDevices: ResponseDevice[] = [
        {
          id: '1',
          name: 'Device1',
          deviceType: 'Type1',
          hasSubDevices: false,
          modelName: 'Model1',
          familyId: 'Family1',
          category: 'Category1',
          online: true,
        },
      ];

      jest
        .spyOn(hejhomeApiService, 'getRoomWithDevices')
        .mockResolvedValue(mockDevices);

      const result = await service.getDevicesWithRoomId(roomsWithHomeId);

      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toBeInstanceOf(RoomWithDeviceDto);
      expect(result[0].roomId).toBe(1);
      expect(result[0].platform).toBe('hejhome');
    });
  });
});
