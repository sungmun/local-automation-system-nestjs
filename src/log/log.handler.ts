import { OnEvent } from '@nestjs/event-emitter';
import { ResponseDeviceState } from '../hejhome-api/hejhome-api.interface';
import { LogService } from './log.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LogHandler {
  constructor(private readonly logService: LogService) {}

  @OnEvent('changed.**', { async: true })
  async autoDeviceLog(state: ResponseDeviceState) {
    await this.logService.autoDeviceChangeLog(state);
  }
}
