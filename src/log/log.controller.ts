import { Controller, Get } from '@nestjs/common';
import { LogService } from './log.service';
import { ResponseDeviceState } from '../hejhome-api/hejhome-api.interface';
import { OnEvent } from '@nestjs/event-emitter';

@Controller('logs')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @OnEvent('changed.**', { async: true })
  async autoDeviceLog(state: ResponseDeviceState) {
    await this.logService.autoDeviceChangeLog(state);
  }

  @Get()
  async findLogs() {
    return this.logService.findLogs();
  }
}
