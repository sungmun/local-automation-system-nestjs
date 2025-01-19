import { Test, TestingModule } from '@nestjs/testing';
import { RoomCrudService } from './room-crud.service';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

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

  it('서비스가 정의되어야 한다', () => {
    expect(service).toBeDefined();
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

      const setCall = mockQueryBuilder.set.mock.calls[0][0];
      const activeFunction = setCall.active;
      const result = activeFunction();

      expect(mockQueryBuilder.update).toHaveBeenCalledWith(Room);
      expect(result).toBe('CASE WHEN id = :roomId THEN true ELSE false END');
      expect(mockQueryBuilder.setParameters).toHaveBeenCalledWith({
        roomId: 1,
      });
      expect(mockQueryBuilder.execute).toHaveBeenCalled();
    });

    it('CASE 문이 올바른 형식을 반환해야 합니다', async () => {
      const mockQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(true),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      await service.setRoomActiveById(2);

      const setCall = mockQueryBuilder.set.mock.calls[0][0];
      const activeFunction = setCall.active;
      const caseStatement = activeFunction();

      expect(caseStatement).toMatch(/^CASE WHEN/);
      expect(caseStatement).toContain('id = :roomId');
      expect(caseStatement).toContain('THEN true');
      expect(caseStatement).toContain('ELSE false');
      expect(caseStatement).toMatch(/END$/);
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

  describe('updateRoom', () => {
    it('방 정보를 업데이트해야 합니다', async () => {
      const roomId = '1';
      const updateData: Partial<Room> = {
        name: '업데이트된 거실',
        temperature: 26,
        humidity: 65,
      };
      const mockUpdateResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      jest.spyOn(repository, 'update').mockResolvedValue(mockUpdateResult);

      const result = await service.updateRoom(roomId, updateData);

      expect(repository.update).toHaveBeenCalledWith(roomId, updateData);
      expect(result).toEqual(mockUpdateResult);
    });

    it('부분적인 업데이트를 수행해야 합니다', async () => {
      const roomId = '1';
      const updateData: Partial<Room> = {
        name: '업데이트된 거실',
      };
      const mockUpdateResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      jest.spyOn(repository, 'update').mockResolvedValue(mockUpdateResult);

      const result = await service.updateRoom(roomId, updateData);

      expect(repository.update).toHaveBeenCalledWith(roomId, updateData);
      expect(result).toEqual(mockUpdateResult);
    });

    it('빈 업데이트 데이터로도 동작해야 합니다', async () => {
      const roomId = '1';
      const updateData: Partial<Room> = {};
      const mockUpdateResult = {
        affected: 0,
        raw: [],
        generatedMaps: [],
      };

      jest.spyOn(repository, 'update').mockResolvedValue(mockUpdateResult);

      const result = await service.updateRoom(roomId, updateData);

      expect(repository.update).toHaveBeenCalledWith(roomId, updateData);
      expect(result).toEqual(mockUpdateResult);
    });
  });
});
