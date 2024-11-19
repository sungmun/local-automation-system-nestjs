import { Test, TestingModule } from '@nestjs/testing';
import { RoomSensorService } from './room-sensor.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('RoomSensorService', () => {
  let service: RoomSensorService;
  let roomRepository: Repository<Room>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomSensorService,
        {
          provide: getRepositoryToken(Room),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<RoomSensorService>(RoomSensorService);
    roomRepository = module.get<Repository<Room>>(getRepositoryToken(Room));
  });

  describe('updateRoomBySensorId', () => {
    it('센서 ID로 방의 정보를 업데이트해야 한다', async () => {
      const sensorId = 'sensor1';
      const updateData = { temperature: 25, humidity: 60 };
      const updateSpy = jest
        .spyOn(roomRepository, 'update')
        .mockResolvedValue(null);
      await service.updateRoomBySensorId(sensorId, updateData);

      expect(updateSpy).toHaveBeenCalledWith({ sensorId }, updateData);
    });
  });

  describe('findRoomBySensorId', () => {
    it('센서 ID로 방을 찾아야 한다', async () => {
      const room = { id: 1, name: '거실', sensorId: 'sensor1' };
      jest.spyOn(roomRepository, 'findOneBy').mockResolvedValue(room as Room);

      const result = await service.findRoomBySensorId('sensor1');
      expect(result).toBe(room);
    });

    it('센서 ID에 해당하는 방이 없으면 예외가 발생해야 한다', async () => {
      jest.spyOn(roomRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findRoomBySensorId('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('setRoomTemperature', () => {
    it('센서 ID로 방의 온도를 설정해야 한다', async () => {
      const room = { id: 1, name: '거실', sensorId: 'sensor1' };
      const findSpy = jest
        .spyOn(roomRepository, 'findOneBy')
        .mockResolvedValue(room as Room);
      const updateSpy = jest
        .spyOn(roomRepository, 'update')
        .mockResolvedValue(null);

      await service.setRoomTemperature('sensor1', 25);

      expect(findSpy).toHaveBeenCalledWith({ sensorId: 'sensor1' });
      expect(updateSpy).toHaveBeenCalledWith(1, { temperature: 25 });
    });
  });

  describe('matchRoomWithSensor', () => {
    it('방에 연결된 센서를 찾아 매칭해야 한다', async () => {
      const room = {
        id: 1,
        devices: [
          { id: 'sensor1', deviceType: 'SensorTh' },
          { id: 'device2', deviceType: 'other' },
        ],
      };

      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(room as any);
      const updateSpy = jest
        .spyOn(roomRepository, 'update')
        .mockResolvedValue(null);

      await service.matchRoomWithSensor(1);

      expect(updateSpy).toHaveBeenCalledWith(1, { sensorId: 'sensor1' });
    });

    it('센서가 없는 경우 업데이트하지 않아야 한다', async () => {
      const room = {
        id: 1,
        devices: [{ id: 'device2', deviceType: 'other' }],
      };

      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(room as any);
      const updateSpy = jest.spyOn(roomRepository, 'update');

      await service.matchRoomWithSensor(1);

      expect(updateSpy).not.toHaveBeenCalled();
    });
  });
});
