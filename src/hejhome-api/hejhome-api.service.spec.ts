import { Test, TestingModule } from '@nestjs/testing';
import { HejhomeApiService } from './hejhome-api.service';

describe('HejhomeApiService', () => {
  let service: HejhomeApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HejhomeApiService],
    }).compile();

    service = module.get<HejhomeApiService>(HejhomeApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
