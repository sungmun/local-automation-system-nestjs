import { Test, TestingModule } from '@nestjs/testing';
import { DataBaseDeviceService } from './database-device.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';

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
      ],
    }).compile();

    service = module.get<DataBaseDeviceService>(DataBaseDeviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
