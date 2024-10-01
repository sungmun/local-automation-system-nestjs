import { Test, TestingModule } from '@nestjs/testing';
import { HejhomeMessageQueueController } from './hejhome-message-queue.controller';
import { HejhomeMessageQueueService } from './hejhome-message-queue.service';

describe('HejhomeMessageQueueController', () => {
  let controller: HejhomeMessageQueueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HejhomeMessageQueueController],
      providers: [HejhomeMessageQueueService],
    }).compile();

    controller = module.get<HejhomeMessageQueueController>(HejhomeMessageQueueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
