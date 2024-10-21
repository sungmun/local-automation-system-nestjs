import { Controller, Logger } from '@nestjs/common';
import { DeviceStateService } from './device-state.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ResponseDeviceState } from '../hejhome-api/hejhome-api.interface';

@Controller()
export class DeviceStateController {
  private readonly logger = new Logger(DeviceStateController.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly deviceStateService: DeviceStateService,
  ) {}

  @OnEvent('set.**', { async: true })
  async hasChangedDevice(state: ResponseDeviceState) {
    const changed = await this.deviceStateService.hasChanged(state.id, state);
    if (changed) {
      this.logger.debug(`hasChangedDevice(${state.deviceType}): ${state.id}`);
      this.eventEmitter.emit(`changed.${state.deviceType}.${state.id}`, state);
    } else {
      this.logger.verbose(`hasChangedDevice(${state.deviceType}):${changed}`);
    }
  }

  @OnEvent('changed.**', { async: true })
  async changeDeviceEvent(state: ResponseDeviceState) {
    this.eventEmitter.emit(`finish.${state.deviceType}.${state.id}`, state);
  }
}
