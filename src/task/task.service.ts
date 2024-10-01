import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as http from 'http';
import * as https from 'https';
import { HejhomeMessageQueueService } from '../hejhome-message-queue/hejhome-message-queue.service';
import { DataBaseDeviceService } from 'src/device/database-device.service';
import { DeviceStatusService } from 'src/device-status/device-status.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor(
    private readonly hejhomeMessageQueueService: HejhomeMessageQueueService,
    private readonly databaseDeviceService: DataBaseDeviceService,
    private readonly deviceStatusService: DeviceStatusService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async hejhomeAPICheck() {
    if (this.hejhomeMessageQueueService.isConnected()) {
      this.logger.log('MQ is connected and not api check');
      return;
    }
    this.logger.debug('hejhomeAPICheck start');
    const devices = await this.databaseDeviceService.findAll();
    for (const device of devices) {
      const status = await this.deviceStatusService.getDeviceStatus(
        device.id,
        device.deviceType,
      );
      this.eventEmitter.emit(`${device.deviceType}.${device.id}`, status);
    }
    this.logger.debug('hejhomeAPICheck end');
  }
}
