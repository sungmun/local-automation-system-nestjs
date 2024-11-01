import { Controller, Get } from '@nestjs/common';
import { DeviceLogService } from './device-log.service';
import { ResponseDeviceState } from 'src/hejhome-api/hejhome-api.interface';
import { OnEvent } from '@nestjs/event-emitter';

@Controller('device-logs')
export class DeviceLogController {
  constructor(private readonly deviceLogService: DeviceLogService) {}

  @OnEvent('changed.**', { async: true })
  async autoLog(state: ResponseDeviceState) {
    await this.deviceLogService.autoChangeLog(state);
  }

  @Get()
  async findLogs() {
    return this.deviceLogService.findLogs();
  }
}
