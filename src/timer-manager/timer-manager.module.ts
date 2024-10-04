import { Module } from '@nestjs/common';
import { TimerManagerService } from './timer-manager.service';

@Module({
  providers: [TimerManagerService],
  exports: [TimerManagerService],
})
export class TimerManagerModule {}
