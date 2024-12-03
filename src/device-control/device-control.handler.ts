import { Injectable, Logger } from '@nestjs/common';
import { DeviceControlService } from './device-control.service';
import { OnEvent } from '@nestjs/event-emitter';
import { ResponseIrAirconditionerState } from '../hejhome-api/hejhome-api.interface';
import { TimerManagerService } from '../timer-manager/timer-manager.service';

@Injectable()
export class DeviceControlHandler {
  private readonly logger = new Logger(DeviceControlHandler.name);

  constructor(
    private readonly deviceControlService: DeviceControlService,
    private readonly timerManagerService: TimerManagerService,
  ) {}

  @OnEvent('set.IrAirconditioner.*', { async: true })
  async hasIrAirConditioner(state: ResponseIrAirconditionerState) {
    if (state.deviceState.power !== '꺼짐') {
      this.timerManagerService.setTimer(
        state.id,
        () => this.deviceControlService.airconditionerOff(state.id),
        60 * 60 * 1000,
      );
    } else {
      this.timerManagerService.clearTimer(state.id);
    }
  }
}
