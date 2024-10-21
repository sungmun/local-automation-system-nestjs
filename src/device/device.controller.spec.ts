import { Test, TestingModule } from '@nestjs/testing';
import { DeviceController } from './device.controller';
import { DataBaseDeviceService } from './database-device.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { MessageTemplateService } from '../message-template/message-template.service';
import { PushMessagingService } from '../push-messaging/push-messaging.service';

describe('DeviceController', () => {
  let controller: DeviceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceController],
      providers: [
        DataBaseDeviceService,
        {
          provide: getRepositoryToken(Device),
          useValue: {},
        },
        {
          provide: MessageTemplateService,
          useValue: {},
        },
        {
          provide: PushMessagingService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<DeviceController>(DeviceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
