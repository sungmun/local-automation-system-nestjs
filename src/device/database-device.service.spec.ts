import { Test, TestingModule } from '@nestjs/testing';
import { DataBaseDeviceService } from './database-device.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { MessageTemplateService } from '../message-template/message-template.service';
import { PushMessagingService } from '../push-messaging/push-messaging.service';

describe('DataBaseDeviceService', () => {
  let service: DataBaseDeviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<DataBaseDeviceService>(DataBaseDeviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
