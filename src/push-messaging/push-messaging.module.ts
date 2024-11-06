import { Module } from '@nestjs/common';
import { PushMessagingService } from './push-messaging.service';
import { LogModule } from '../log/log.module';

@Module({
  imports: [LogModule],
  providers: [PushMessagingService],
  exports: [PushMessagingService],
})
export class PushMessagingModule {}
