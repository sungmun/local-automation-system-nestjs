import { Test, TestingModule } from '@nestjs/testing';
import { PushMessagingService } from './push-messaging.service';
import { ConfigService } from '@nestjs/config'; // ConfigService를 가져옵니다.

describe('PushMessagingService', () => {
  let service: PushMessagingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PushMessagingService,
        {
          provide: ConfigService,
          useValue: {}, // 필요한 경우 모의 객체를 설정
        },
      ],
    }).compile();

    service = module.get<PushMessagingService>(PushMessagingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
