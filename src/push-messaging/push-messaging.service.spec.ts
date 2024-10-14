import { Test, TestingModule } from '@nestjs/testing';
import { PushMessagingService } from './push-messaging.service';

describe('PushMessagingService', () => {
  let service: PushMessagingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PushMessagingService],
    }).compile();

    service = module.get<PushMessagingService>(PushMessagingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
