import { Test, TestingModule } from '@nestjs/testing';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';
import { DeviceControlService } from '../device-control/device-control.service';
import { DataBaseDeviceService } from '../device/database-device.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { UpdateRoomDto } from './dto/updateRoom.dto';
import { ResponseSensorTHState } from 'src/hejhome-api/hejhome-api.interface';

describe('RoomController', () => {
  let controller: RoomController;
  let roomService: RoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomController],
      providers: [
        RoomService,
        {
          provide: HejhomeApiService,
          useValue: {},
        },
        {
          provide: DeviceControlService,
          useValue: {},
        },
        {
          provide: DataBaseDeviceService,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Room),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<RoomController>(RoomController);
    roomService = module.get<RoomService>(RoomService);
  });

  it('컨트롤러가 정의되어야 한다', () => {
    expect(controller).toBeDefined();
  });

  describe('setActiveRoom', () => {
    it('방을 활성화해야 한다', async () => {
      const roomId = 1;
      const getRoomByIdSpy = jest
        .spyOn(roomService, 'getRoomById')
        .mockResolvedValue({ id: roomId } as any);
      const setRoomActiveByIdSpy = jest
        .spyOn(roomService, 'setRoomActiveById')
        .mockResolvedValue();

      const result = await controller.setActiveRoom(roomId);

      expect(setRoomActiveByIdSpy).toHaveBeenCalledWith(roomId);
      expect(getRoomByIdSpy).toHaveBeenCalledWith(roomId);
      expect(result).toEqual({ id: roomId });
    });
  });

  describe('setRoom', () => {
    it('방을 업데이트해야 한다', async () => {
      const roomId = 1;
      const updateRoomDto: UpdateRoomDto = { name: '새로운 방 이름' };
      const getRoomByIdSpy = jest
        .spyOn(roomService, 'getRoomById')
        .mockResolvedValue({ id: roomId } as any);
      const setRoomByIdSpy = jest
        .spyOn(roomService, 'setRoomById')
        .mockResolvedValue(true);

      const result = await controller.setRoom(roomId, updateRoomDto);

      expect(setRoomByIdSpy).toHaveBeenCalledWith(roomId, updateRoomDto);
      expect(getRoomByIdSpy).toHaveBeenCalledWith(roomId);
      expect(result).toEqual({ id: roomId });
    });
  });

  describe('setRoomTemperature', () => {
    it('RoomService의 setRoomTemperature가 올바른 인자로 호출되어야 한다', async () => {
      const state: ResponseSensorTHState = {
        id: 'sensor1',
        deviceType: 'SensorTh',
        deviceState: { temperature: 2500, humidity: 50, battery: 90 },
      };
      jest
        .spyOn(roomService, 'setRoomTemperature')
        .mockResolvedValue({} as any);
      const loggerSpy = jest.spyOn(controller['logger'], 'debug');
      await controller.setRoomTemperature(state);

      expect(loggerSpy).toHaveBeenCalledWith('setRoomTemperature', state);
      expect(roomService.setRoomTemperature).toHaveBeenCalledWith(
        'sensor1',
        2500,
      );
    });
  });
});
