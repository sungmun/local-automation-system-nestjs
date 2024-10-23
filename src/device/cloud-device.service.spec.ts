import { Test, TestingModule } from '@nestjs/testing';
import { CloudDeviceService } from './cloud-device.service';
import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';
import {
  ResponseDevice,
  ResponseRoom,
} from '../hejhome-api/hejhome-api.interface';

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
        {
          id: '2',
          name: 'Device2',
          deviceType: 'Type2',
          hasSubDevices: false,
          modelName: 'Model2',
          familyId: 'Family2',
          category: 'Category2',
          online: true,
        },
      ];
      const result = await service.getUniqueDevices(devices);
      expect(result).toHaveLength(2);
    });
  });

  describe('getDevices', () => {
    it('장치 목록을 반환해야 한다', async () => {
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
      ];
      jest.spyOn(hejhomeApiService, 'getDevices').mockResolvedValue(devices);

      const result = await service.getDevices();
      expect(result).toEqual(devices);
    });
  });

  describe('getDevicesWithRoomId', () => {
    it('방 ID가 포함된 장치 목록을 반환해야 한다', async () => {
      const roomsWithHomeId: (ResponseRoom & { homeId: number })[] = [
        { name: 'Room1', room_id: 1, homeId: 1 },
      ];
      const devicesWithRoomId = [
        {
          id: '1',
          name: 'Device1',
          deviceType: 'Type1',
          hasSubDevices: false,
          modelName: 'Model1',
          familyId: 'Family1',
          category: 'Category1',
          online: true,
          roomId: 1,
        },
      ];
      jest
        .spyOn(hejhomeApiService, 'getRoomWithDevices')
        .mockResolvedValue(devicesWithRoomId);

      const result = await service.getDevicesWithRoomId(roomsWithHomeId);
      expect(result).toEqual(devicesWithRoomId);
    });
  });
});
