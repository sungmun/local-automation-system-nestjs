import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HejhomeMessageQueueService } from '../hejhome-message-queue/hejhome-message-queue.service';
import { DataBaseDeviceService } from '../device/database-device.service';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { DeviceStateService } from '../device-state/device-state.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor(
    private readonly hejhomeMessageQueueService: HejhomeMessageQueueService,
    private readonly databaseDeviceService: DataBaseDeviceService,
    private readonly deviceStateService: DeviceStateService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  @Cron(CronExpression.EVERY_30_SECONDS)
  async checkDevicesEvery30Seconds() {
    if (this.hejhomeMessageQueueService.isConnected()) {
      this.logger.log('MQ is connected and not api check');
      return;
    }
    this.logger.fatal(`-=-=-=-=-=-=-=-=-=-=-=-`);
    this.hejhomeAPICheck();
  }

  async hejhomeAPICheck() {
    const devices = await this.databaseDeviceService.findAll();
    for (const device of devices) {
      const state = await this.deviceStateService.getDeviceState(
        device.id,
        device.deviceType,
      );
      this.logger.debug(`set.${device.deviceType}.${device.id}`);
      this.eventEmitter.emit(`set.${device.deviceType}.${device.id}`, state);
    }
  }
}
