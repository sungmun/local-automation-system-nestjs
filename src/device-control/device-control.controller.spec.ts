import { Test, TestingModule } from '@nestjs/testing';
import { DeviceControlController } from './device-control.controller';
import { DeviceControlService } from './device-control.service';
import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';
import { TimerManagerService } from '../timer-manager/timer-manager.service';

describe('DeviceControlController', () => {
  let controller: DeviceControlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceControlController],
      providers: [
        DeviceControlService,
        {
          provide: HejhomeApiService,
          useValue: {},
        },
        {
          provide: TimerManagerService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<DeviceControlController>(DeviceControlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
