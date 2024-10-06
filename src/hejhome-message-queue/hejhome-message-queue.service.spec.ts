import { Test, TestingModule } from '@nestjs/testing';
import { HejhomeMessageQueueService } from './hejhome-message-queue.service';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

describe('HejhomeMessageQueueService', () => {
  let service: HejhomeMessageQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HejhomeMessageQueueService,
        {
          provide: AmqpConnection,
          useValue: {
            connected: true,
          },
        },
      ],
    }).compile();

    service = module.get<HejhomeMessageQueueService>(
      HejhomeMessageQueueService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
