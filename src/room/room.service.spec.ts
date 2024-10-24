import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './room.service';
import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';
import { DeviceControlService } from '../device-control/device-control.service';
import { DataBaseDeviceService } from '../device/database-device.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateRoomDto } from './dto/updateRoom.dto';

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
            getHomeWithRooms: jest.fn(),
            getHomes: jest.fn(),
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
    it('주어진 roomId에 따라 방의 active 상태를 업데이트해야 한다', async () => {
      const createQueryBuilder: any = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockImplementation((setObject) => {
          const activeFunction = setObject.active;
          const result = activeFunction();
          expect(result).toBe(
            `CASE WHEN id = :roomId THEN true ELSE false END`,
          );
          return createQueryBuilder;
        }),
        setParameters: jest.fn().mockReturnThis(),
        execute: jest.fn(),
      };

      jest
        .spyOn(roomRepository, 'createQueryBuilder')
        .mockReturnValue(createQueryBuilder);

      const roomId = 1;
      await service.setRoomActiveById(roomId);

      expect(createQueryBuilder.update).toHaveBeenCalledWith(Room);
      expect(createQueryBuilder.set).toHaveBeenCalledWith({
        active: expect.any(Function),
      });
      expect(createQueryBuilder.setParameters).toHaveBeenCalledWith({ roomId });
      expect(createQueryBuilder.execute).toHaveBeenCalled();
    });
  });

  describe('getRoomById', () => {
    it('ID로 방을 반환해야 한다', async () => {
      const room = { id: 1, name: '방 1' };
      jest.spyOn(roomRepository, 'findOneBy').mockResolvedValue(room as any);
      const result = await service.getRoomById(1);
      expect(result).toEqual(room);
    });

    it('존재하지 않는 ID로 방을 요청하면 예외를 발생시켜야 한다', async () => {
      jest.spyOn(roomRepository, 'findOneBy').mockResolvedValue(null);
      await expect(service.getRoomById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getRoomsWithHomeId', () => {
    it('홈 ID로 방 목록을 가져와야 한다', async () => {
      const homes = [{ name: '홈 이름', homeId: 1 }];
      const rooms = [{ name: '방 1', room_id: 1 }];
      jest
        .spyOn(service['hejhomeApiService'], 'getHomeWithRooms')
        .mockResolvedValue({ home: '홈 이름', rooms }); // 'home' 필드 추가
      const result = await service.getRoomsWithHomeId(homes);
      expect(result).toEqual([{ name: '방 1', room_id: 1, homeId: 1 }]);
    });
  });

  describe('getHomesWithRooms', () => {
    it('홈과 방 목록을 가져와야 한다', async () => {
      const homes = [{ name: '홈 이름', homeId: 1 }];
      jest
        .spyOn(service['hejhomeApiService'], 'getHomes')
        .mockResolvedValue(homes);
      jest
        .spyOn(service, 'getRoomsWithHomeId')
        .mockResolvedValue([{ name: '방 1', room_id: 1, homeId: 1 }]);
      const result = await service.getHomesWithRooms();
      expect(result).toEqual([{ name: '방 1', room_id: 1, homeId: 1 }]);
    });
  });

  describe('updateRoom', () => {
    it('방 정보를 업데이트해야 한다', async () => {
      const updateSpy = jest
        .spyOn(roomRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      await service.updateRoom('1', { name: '업데이트된 방' } as Room);
      expect(updateSpy).toHaveBeenCalledWith('1', { name: '업데이트된 방' });
    });
  });

  describe('findRoomBySensorId', () => {
    it('센서 ID로 방을 찾아야 한다', async () => {
      const room = { id: 1, sensorId: 'sensor1' };
      jest.spyOn(roomRepository, 'findOneBy').mockResolvedValue(room as any);
      const result = await service.findRoomBySensorId('sensor1');
      expect(result).toEqual(room);
    });

    it('존재하지 않는 센서 ID로 요청 시 예외를 발생시켜야 한다', async () => {
      jest.spyOn(roomRepository, 'findOneBy').mockResolvedValue(null);
      await expect(service.findRoomBySensorId('sensor999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('setRoomTemperature', () => {
    it('방의 온도를 설정해야 한다', async () => {
      const room = { id: 1, sensorId: 'sensor1' };
      jest.spyOn(service, 'findRoomBySensorId').mockResolvedValue(room as any);
      const updateSpy = jest
        .spyOn(roomRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      await service.setRoomTemperature('sensor1', 25);
      expect(updateSpy).toHaveBeenCalledWith(1, { temperature: 25 });
    });
  });

  describe('initRooms', () => {
    it('방 목록을 초기화해야 한다', async () => {
      const insertSpy = jest
        .spyOn(roomRepository, 'createQueryBuilder')
        .mockReturnValue({
          insert: jest.fn().mockReturnThis(),
          values: jest.fn().mockReturnThis(),
          orIgnore: jest.fn().mockReturnThis(),
          execute: jest.fn(),
        } as any);
      await service.initRooms([{ id: 1, name: '방 1' } as Room]);
      expect(insertSpy).toHaveBeenCalled();
    });
  });

  describe('matchRoomWithSensor', () => {
    it('방과 센서를 매칭해야 한다', async () => {
      const room = {
        id: 1,
        devices: [{ id: 'device1', deviceType: 'SensorTh' }],
      };
      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(room as any);
      const updateSpy = jest
        .spyOn(roomRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      await service.matchRoomWithSensor(1);
      expect(updateSpy).toHaveBeenCalledWith(1, { sensorId: 'device1' });
    });

    it('센서가 없는 방은 매칭하지 않아야 한다', async () => {
      const room = { id: 1, devices: [] };
      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(room as any);
      const updateSpy = jest.spyOn(roomRepository, 'update');
      await service.matchRoomWithSensor(1);
      expect(updateSpy).not.toHaveBeenCalled();
    });
  });

  describe('activeRoomTemperatureControl', () => {
    it('활성화된 방이 없으면 아무 작업도 하지 않아야 한다', async () => {
      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(null);
      await service.activeRoomTemperatureControl(26);
      expect(
        service['deviceControlService'].airconditionerOn,
      ).not.toHaveBeenCalled();
    });
    it('온도가 시작 온도보다 높으면 에어컨을 켜야 한다', async () => {
      const room = {
        id: 1,
        active: true,
        acStartTemperature: 25,
        acStopTemperature: 20,
      };
      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(room as any);
      const devices = [
        {
          id: 'device1',
          name: '디바이스 이름',
          deviceType: 'SensorTh',
          modelName: '모델 이름',
          familyId: '가족 ID',
          category: '카테고리',
          online: true,
          hasSubDevices: false,
          active: true,
          activeMessageTemplate: false,
        },
      ];
      jest
        .spyOn(
          service['databaseDeviceService'],
          'getDevicesByRoomOrUnassignedAndDeviceType',
        )
        .mockResolvedValue(devices);

      await service.activeRoomTemperatureControl(26);

      expect(
        service['deviceControlService'].airconditionerOn,
      ).toHaveBeenCalledWith('device1');
    });

    it('온도가 정지 온도보다 낮으면 에어컨을 꺼야 한다', async () => {
      const room = {
        id: 1,
        active: true,
        acStartTemperature: 25,
        acStopTemperature: 20,
      };
      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(room as any);
      const devices = [
        {
          id: 'device1',
          name: '디바이스 이름',
          deviceType: 'SensorTh',
          modelName: '모델 이름',
          familyId: '가족 ID',
          category: '카테고리',
          online: true,
          hasSubDevices: false, // 추가된 필드
          active: true, // 추가된 필드
          activeMessageTemplate: false, // 추가된 필드
        },
      ];
      jest
        .spyOn(
          service['databaseDeviceService'],
          'getDevicesByRoomOrUnassignedAndDeviceType',
        )
        .mockResolvedValue(devices);

      await service.activeRoomTemperatureControl(19);

      expect(
        service['deviceControlService'].airconditionerOff,
      ).toHaveBeenCalledWith('device1');
    });

    it('온도가 시작 및 정지 온도 사이에 있으면 아무 작업도 하지 않아야 한다', async () => {
      const room = {
        id: 1,
        active: true,
        acStartTemperature: 25,
        acStopTemperature: 20,
      };
      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(room as any);

      await service.activeRoomTemperatureControl(22);

      expect(
        service['deviceControlService'].airconditionerOn,
      ).not.toHaveBeenCalled();
      expect(
        service['deviceControlService'].airconditionerOff,
      ).not.toHaveBeenCalled();
    });
  });
});
