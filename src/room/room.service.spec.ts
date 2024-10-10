import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './room.service';
import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';
import { DeviceControlService } from '../device-control/device-control.service';
import { DataBaseDeviceService } from '../device/database-device.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('RoomService', () => {
  let service: RoomService;
  let roomRepository: Repository<Room>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomService,
        {
          provide: HejhomeApiService,
          useValue: {
            getHomesWithRooms: jest.fn(),
            getHomeWithRooms: jest.fn(),
          },
        },
        {
          provide: DeviceControlService,
          useValue: {
            airconditionerOn: jest.fn(),
            airconditionerOff: jest.fn(),
          },
        },
        {
          provide: DataBaseDeviceService,
          useValue: {
            getDevicesByRoomOrUnassignedAndDeviceType: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Room),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<RoomService>(RoomService);
    roomRepository = module.get<Repository<Room>>(getRepositoryToken(Room));
  });

  it('서비스가 정의되어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('setRoomById', () => {
    it('ID로 방을 업데이트해야 한다', async () => {
      const updateSpy = jest
        .spyOn(roomRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      const result = await service.setRoomById(1, { name: '새로운 방' });
      expect(updateSpy).toHaveBeenCalledWith(1, { name: '새로운 방' });
      expect(result).toBe(true);
    });

    it('업데이트할 필드가 없으면 false를 반환해야 한다', async () => {
      const result = await service.setRoomById(1, {});
      expect(result).toBe(false);
    });
  });

  describe('setRoomActiveById', () => {
    it('ID로 방을 활성화해야 한다', async () => {
      const updateSpy = jest
        .spyOn(roomRepository, 'createQueryBuilder')
        .mockReturnValue({
          update: jest.fn().mockReturnThis(),
          set: jest.fn().mockReturnThis(),
          setParameters: jest.fn().mockReturnThis(),
          execute: jest.fn(),
        } as any);

      await service.setRoomActiveById(1);
      expect(updateSpy).toHaveBeenCalled();
    });
  });

  describe('getRoomById', () => {
    it('ID로 방을 반환해야 한다', async () => {
      const room = { id: 1, name: '방 1' };
      jest.spyOn(roomRepository, 'findOneBy').mockResolvedValue(room as any);
      const result = await service.getRoomById(1);
      expect(result).toEqual(room);
    });
  });

  describe('findRoomBySensorId', () => {
    it('방을 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      jest.spyOn(roomRepository, 'findOneBy').mockResolvedValue(null);
      await expect(service.findRoomBySensorId('sensor1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
