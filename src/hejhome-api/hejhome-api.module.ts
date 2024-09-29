import { Module } from '@nestjs/common';
import { HejhomeApiService } from './hejhome-api.service';

@Module({
  providers: [HejhomeApiService],
  exports: [HejhomeApiService],
})
export class HejhomeApiModule {}
