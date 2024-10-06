import { Test, TestingModule } from '@nestjs/testing';
import { DeviceStateController } from './device-state.controller';
import { DeviceStateService } from './device-state.service';
import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';
import { DataBaseDeviceService } from '../device/database-device.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('DeviceStateController', () => {
  let controller: DeviceStateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceStateController],
      providers: [
        DeviceStateService,
        {
          provide: HejhomeApiService,
          useValue: {},
        },
        {
          provide: DataBaseDeviceService,
          useValue: {},
        },
        {
          provide: EventEmitter2,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<DeviceStateController>(DeviceStateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
