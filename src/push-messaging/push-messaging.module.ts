import { Module } from '@nestjs/common';
import { PushMessagingService } from './push-messaging.service';

@Module({
  providers: [PushMessagingService],
})
export class PushMessagingModule {}
