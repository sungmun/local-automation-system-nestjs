import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: HejhomeApiService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
