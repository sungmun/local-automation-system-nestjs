import { Test, TestingModule } from '@nestjs/testing';
import { HejHomeRoomService } from './hej-home-room.service';
import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';
import {
  ResponseHome,
  ResponseHomeWithRooms,
} from '../hejhome-api/hejhome-api.interface';

describe('HejHomeRoomService', () => {
  let service: HejHomeRoomService;
  let hejhomeApiService: jest.Mocked<HejhomeApiService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HejHomeRoomService,
        {
          provide: HejhomeApiService,
          useValue: {
            getHomes: jest.fn(),
            getHomeWithRooms: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<HejHomeRoomService>(HejHomeRoomService);
    hejhomeApiService = module.get(HejhomeApiService);
  });

  describe('getRoomsWithHomeId', () => {
    it('홈 ID와 함께 방 목록을 반환해야 한다', async () => {
      const mockHomes: ResponseHome['result'] = [
        { homeId: 1, name: '우리집' },
        { homeId: 2, name: '별장' },
      ];

      const mockHomeWithRooms1: ResponseHomeWithRooms = {
        home: '우리집',
        rooms: [
          { name: '거실', room_id: 1 },
          { name: '안방', room_id: 2 },
        ],
      };

      const mockHomeWithRooms2: ResponseHomeWithRooms = {
        home: '별장',
        rooms: [{ name: '거실', room_id: 3 }],
      };

      hejhomeApiService.getHomeWithRooms
        .mockResolvedValueOnce(mockHomeWithRooms1)
        .mockResolvedValueOnce(mockHomeWithRooms2);

      const result = await service.getRoomsWithHomeId(mockHomes);

      expect(result).toEqual([
        { name: '거실', room_id: 1, homeId: 1 },
        { name: '안방', room_id: 2, homeId: 1 },
        { name: '거실', room_id: 3, homeId: 2 },
      ]);

      expect(hejhomeApiService.getHomeWithRooms).toHaveBeenCalledTimes(2);
      expect(hejhomeApiService.getHomeWithRooms).toHaveBeenCalledWith(1);
      expect(hejhomeApiService.getHomeWithRooms).toHaveBeenCalledWith(2);
    });

    it('홈이 없는 경우 빈 배열을 반환해야 한다', async () => {
      const mockHomes: ResponseHome['result'] = [];

      const result = await service.getRoomsWithHomeId(mockHomes);

      expect(result).toEqual([]);
      expect(hejhomeApiService.getHomeWithRooms).not.toHaveBeenCalled();
    });
  });

  describe('getHomesWithRooms', () => {
    it('모든 홈의 방 목록을 반환해야 한다', async () => {
      const mockHomes: ResponseHome['result'] = [{ homeId: 1, name: '우리집' }];

      const mockHomeWithRooms: ResponseHomeWithRooms = {
        home: '우리집',
        rooms: [
          { name: '거실', room_id: 1 },
          { name: '안방', room_id: 2 },
        ],
      };

      hejhomeApiService.getHomes.mockResolvedValue(mockHomes);
      hejhomeApiService.getHomeWithRooms.mockResolvedValue(mockHomeWithRooms);

      const result = await service.getHomesWithRooms();

      expect(result).toEqual([
        { name: '거실', room_id: 1, homeId: 1 },
        { name: '안방', room_id: 2, homeId: 1 },
      ]);

      expect(hejhomeApiService.getHomes).toHaveBeenCalled();
      expect(hejhomeApiService.getHomeWithRooms).toHaveBeenCalledWith(1);
    });

    it('홈이 없는 경우 빈 배열을 반환해야 한다', async () => {
      hejhomeApiService.getHomes.mockResolvedValue([]);

      const result = await service.getHomesWithRooms();

      expect(result).toEqual([]);
      expect(hejhomeApiService.getHomeWithRooms).not.toHaveBeenCalled();
    });
  });
});
