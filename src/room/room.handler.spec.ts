import { Test, TestingModule } from '@nestjs/testing';
import { RoomHandler } from './room.handler';
import { RoomService } from './room.service';
import { RoomSensorService } from './room-sensor.service';
import { ResponseSensorTHState } from '../hejhome-api/hejhome-api.interface';

describe('RoomHandler', () => {
  let handler: RoomHandler;
  let roomService: RoomService;
  let roomSensorService: RoomSensorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomHandler,
        {
          provide: RoomService,
          useValue: {
            activeRoomRecipe: jest.fn(),
          },
        },
        {
          provide: RoomSensorService,
          useValue: {
            updateRoomBySensorId: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<RoomHandler>(RoomHandler);
    roomService = module.get<RoomService>(RoomService);
    roomSensorService = module.get<RoomSensorService>(RoomSensorService);
  });

  it('핸들러가 정의되어야 한다', () => {
    expect(handler).toBeDefined();
  });

  describe('handleTemperatureFinish', () => {
    it('센서 상태 완료시 레시피를 활성화해야 한다', async () => {
      const state: ResponseSensorTHState = {
        id: 'sensor1',
        deviceType: 'SensorTh',
        deviceState: {
          temperature: 2500,
          humidity: 50,
          battery: 90,
        },
      };

      const loggerSpy = jest.spyOn(handler['logger'], 'debug');
      await handler.handleTemperatureFinish(state);

      expect(loggerSpy).toHaveBeenCalledWith('handleTemperatureFinish', state);
      expect(roomService.activeRoomRecipe).toHaveBeenCalledWith('sensor1');
    });
  });

  describe('handleTemperatureOrHumidityChange', () => {
    it('센서 상태 변경시 방의 온습도를 업데이트해야 한다', async () => {
      const state: ResponseSensorTHState = {
        id: 'sensor1',
        deviceType: 'SensorTh',
        deviceState: {
          temperature: 2500,
          humidity: 50,
          battery: 90,
        },
      };

      await handler.handleTemperatureOrHumidityChange(state);

      expect(roomSensorService.updateRoomBySensorId).toHaveBeenCalledWith(
        'sensor1',
        {
          temperature: 2500,
          humidity: 50,
        },
      );
    });
  });
});
