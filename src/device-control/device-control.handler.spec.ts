import { Test, TestingModule } from '@nestjs/testing';
import { DeviceControlHandler } from './device-control.handler';
import { DeviceControlService } from './device-control.service';
import { TimerManagerService } from '../timer-manager/timer-manager.service';
import { ResponseIrAirconditionerState } from '../hejhome-api/hejhome-api.interface';

describe('DeviceControlHandler', () => {
  let handler: DeviceControlHandler;
  let deviceControlService: DeviceControlService;
  let timerManagerService: TimerManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceControlHandler,
        {
          provide: DeviceControlService,
          useValue: {
            airconditionerOff: jest.fn(),
          },
        },
        {
          provide: TimerManagerService,
          useValue: {
            setTimer: jest.fn(),
            clearTimer: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<DeviceControlHandler>(DeviceControlHandler);
    deviceControlService =
      module.get<DeviceControlService>(DeviceControlService);
    timerManagerService = module.get<TimerManagerService>(TimerManagerService);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('hasIrAirConditioner', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it('에어컨이 켜져 있을 때 타이머를 설정하고, 타이머 만료 시 에어컨을 꺼야 한다', async () => {
      const state: ResponseIrAirconditionerState = {
        id: 'device1',
        deviceType: 'IrAirconditioner',
        deviceState: { power: '켜짐', temperature: '24', mode: 1, fanSpeed: 2 },
      };

      await handler.hasIrAirConditioner(state);

      expect(timerManagerService.setTimer).toHaveBeenCalledWith(
        'device1',
        expect.any(Function),
        60 * 60 * 1000,
      );

      // setTimer에 전달된 콜백 함수 실행
      const setTimerCallback = (timerManagerService.setTimer as jest.Mock).mock
        .calls[0][1];

      // 모든 타이머 실행
      jest.runAllTimers();

      setTimerCallback();
      expect(deviceControlService.airconditionerOff).toHaveBeenCalledWith(
        'device1',
      );
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('에어컨이 꺼져 있을 때 타이머를 해제해야 한다', async () => {
      const state: ResponseIrAirconditionerState = {
        id: 'device1',
        deviceType: 'IrAirconditioner',
        deviceState: { power: '꺼짐', temperature: '24', mode: 1, fanSpeed: 2 },
      };

      await handler.hasIrAirConditioner(state);

      expect(timerManagerService.clearTimer).toHaveBeenCalledWith('device1');
    });
  });
});
