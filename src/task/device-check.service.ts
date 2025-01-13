import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DeviceStateService } from '../device-state/device-state.service';

import type { ResponseDeviceState } from '../hejhome-api/hejhome-api.interface';

@Injectable()
export class DeviceCheckService {
  private readonly logger = new Logger(DeviceCheckService.name);

  constructor(
    private readonly deviceStateService: DeviceStateService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async checkDevices() {
    const deviceStates = await this.deviceStateService.getDeviceStateAll();
    for (const device of deviceStates) {
      await this.emitDeviceState(device);
    }
  }

  private emitDeviceState(device: ResponseDeviceState) {
    const eventName = `set.${device.deviceType}.${device.id}`;
    this.logger.debug(`장치 상태 이벤트 발생: ${eventName}`);
    this.eventEmitter.emit(eventName, device);
  }
}
