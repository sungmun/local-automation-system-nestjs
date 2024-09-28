import { Module } from '@nestjs/common';
import { InitService } from './init.service';

@Module({
  providers: [InitService]
})
export class InitModule {}
