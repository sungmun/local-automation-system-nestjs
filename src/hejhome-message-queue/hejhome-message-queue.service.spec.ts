import { Test, TestingModule } from '@nestjs/testing';
import { HejhomeMessageQueueService } from './hejhome-message-queue.service';

describe('HejhomeMessageQueueService', () => {
  let service: HejhomeMessageQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HejhomeMessageQueueService],
    }).compile();

    service = module.get<HejhomeMessageQueueService>(HejhomeMessageQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
