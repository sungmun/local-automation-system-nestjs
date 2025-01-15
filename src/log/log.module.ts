import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { LogHandler } from './log.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  controllers: [LogController],
  providers: [LogService, LogHandler],
  exports: [LogService],
})
export class LogModule {}
