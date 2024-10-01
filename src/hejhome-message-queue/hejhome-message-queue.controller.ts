import { Controller } from '@nestjs/common';
import { HejhomeMessageQueueService } from './hejhome-message-queue.service';

@Controller()
export class HejhomeMessageQueueController {
  constructor(private readonly hejhomeMessageQueueService: HejhomeMessageQueueService) {}
}
