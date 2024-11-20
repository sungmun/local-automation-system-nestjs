import { Test, TestingModule } from '@nestjs/testing';
import { RoomCrudService } from './room-crud.service';
import { Room } from './entities/room.entity';
import { Repository, UpdateResult } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateRoomDto } from './dto/updateRoom.dto';

describe('RoomCrudService', () => {
  let service: RoomCrudService;
  let repository: Repository<Room>;

  const mockRoom: Room = {
    id: 1,
    name: '거실',
    temperature: 25,
    humidity: 60,
    sensorId: 'sensor-1',
    active: true,
    acStartTemperature: 27.5,
    acStopTemperature: 28.5,
    heatingStartTemperature: 18,
    heatingStopTemperature: 20,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomCrudService,
        {
          provide: getRepositoryToken(Room),
          useValue: {
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              update: jest.fn().mockReturnThis(),
              set: jest.fn().mockReturnThis(),
              setParameters: jest.fn().mockReturnThis(),
              execute: jest.fn().mockResolvedValue(true),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<RoomCrudService>(RoomCrudService);
    repository = module.get<Repository<Room>>(getRepositoryToken(Room));
  });

  describe('setRoomById', () => {
    it('방 정보를 성공적으로 업데이트해야 합니다', async () => {
      const updateDto: UpdateRoomDto = {
        name: '업데이트된 방',
        acStartTemperature: 26,
      };

      jest
        .spyOn(repository, 'update')
        .mockResolvedValue({ affected: 1, raw: [] } as UpdateResult);

      const result = await service.setRoomById(1, updateDto);

      expect(result).toBe(true);
      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('빈 업데이트 데이터가 주어지면 false를 반환해야 합니다', async () => {
      const result = await service.setRoomById(1, {});

      expect(result).toBe(false);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('findRoomById', () => {
    it('ID로 방을 찾아야 합니다', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockRoom);

      const result = await service.findRoomById(1);

      expect(result).toEqual(mockRoom);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('방을 찾지 못하면 NotFoundException을 발생시켜야 합니다', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findRoomById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('setRoomActiveById', () => {
    it('특정 방만 활성화하고 나머지는 비활성화해야 합니다', async () => {
      const mockQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(true),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      await service.setRoomActiveById(1);

      expect(mockQueryBuilder.update).toHaveBeenCalledWith(Room);
      expect(mockQueryBuilder.set).toHaveBeenCalledWith({
        active: expect.any(Function),
      });
      expect(mockQueryBuilder.setParameters).toHaveBeenCalledWith({
        roomId: 1,
      });
      expect(mockQueryBuilder.execute).toHaveBeenCalled();
    });
  });

  describe('getRoomById', () => {
    it('선택된 컬럼으로 방 정보를 반환해야 합니다', async () => {
      const selectedRoom = {
        id: 1,
        name: '거실',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(selectedRoom as Room);

      const result = await service.getRoomById(1, ['id', 'name']);

      expect(result).toEqual(selectedRoom);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        select: ['id', 'name'],
      });
    });

    it('방을 찾지 못하면 NotFoundException을 발생시켜야 합니다', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.getRoomById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('모든 방 목록을 반환해야 합니다', async () => {
      const mockRooms = [mockRoom];
      jest.spyOn(repository, 'find').mockResolvedValue(mockRooms);

      const result = await service.findAll();

      expect(result).toEqual(mockRooms);
      expect(repository.find).toHaveBeenCalled();
    });
  });
});
