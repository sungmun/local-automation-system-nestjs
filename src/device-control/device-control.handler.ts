import { Injectable, Logger } from '@nestjs/common';
import { DeviceControlService } from './device-control.service';

import { ResponseIrAirconditionerState } from '../hejhome-api/hejhome-api.interface';
import { TimerManagerService } from '../timer-manager/timer-manager.service';
import { OnSafeEvent } from '../common/decorators/safe-event.decoratot';

@Injectable()
export class DeviceControlHandler {
  private readonly logger = new Logger(DeviceControlHandler.name);

  constructor(
    private readonly deviceControlService: DeviceControlService,
    private readonly timerManagerService: TimerManagerService,
  ) {}

  @OnSafeEvent('set.IrAirconditioner.*', { async: true })
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
