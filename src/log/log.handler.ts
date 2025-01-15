import { ResponseDeviceState } from '../hejhome-api/hejhome-api.interface';
import { LogService } from './log.service';
import { Injectable } from '@nestjs/common';
import { OnSafeEvent } from '../common/decorators/safe-event.decoratot';

@Injectable()
export class LogHandler {
  constructor(private readonly logService: LogService) {}

  @OnSafeEvent('changed.**', { async: true })
  async autoDeviceLog(state: ResponseDeviceState) {
    await this.logService.autoDeviceChangeLog(state);
  }
}
