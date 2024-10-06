import { Test, TestingModule } from '@nestjs/testing';
import { DeviceController } from './device.controller';
import { DataBaseDeviceService } from './database-device.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';

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
      ],
    }).compile();

    controller = module.get<DeviceController>(DeviceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
