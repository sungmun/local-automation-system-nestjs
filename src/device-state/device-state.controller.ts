import { Controller, Logger } from '@nestjs/common';
import { DeviceStateService } from './device-state.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
  ResponseDeviceState,
  ResponseIrAirconditionerState,
  ResponseSensorTHState,
} from '../hejhome-api/hejhome-api.interface';
import { TimerManagerService } from '../timer-manager/timer-manager.service';

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

  @OnEvent('changed.IrAirconditioner.*', { async: true })
  async IrAirconditionerEvent(state: ResponseIrAirconditionerState) {
    this.eventEmitter.emit(`finish.${state.deviceType}.${state.id}`, state);
  }

  @OnEvent('changed.SensorTh.*', { async: true })
  async SensorThEvent(state: ResponseSensorTHState) {
    this.eventEmitter.emit(`finish.${state.deviceType}.${state.id}`, state);
  }
}
