import { Module } from '@nestjs/common';
import { PushMessagingService } from './push-messaging.service';

@Module({
  providers: [PushMessagingService],
  exports: [PushMessagingService],
})
export class PushMessagingModule {}
