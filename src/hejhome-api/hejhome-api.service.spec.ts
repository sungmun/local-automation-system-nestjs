import { Test, TestingModule } from '@nestjs/testing';
import { HejhomeApiService } from './hejhome-api.service';
import { ConfigService } from '@nestjs/config';

describe('HejhomeApiService', () => {
  let service: HejhomeApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HejhomeApiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'CLIENT_ID') return 'testClientId';
              if (key === 'CLIENT_SECRET') return 'testClientSecret';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<HejhomeApiService>(HejhomeApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
