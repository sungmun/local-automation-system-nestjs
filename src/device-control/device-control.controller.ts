import { Controller, Logger } from '@nestjs/common';
import { DeviceControlService } from './device-control.service';
import { OnEvent } from '@nestjs/event-emitter';
import { ResponseIrAirconditionerState } from 'src/hejhome-api/hejhome-api.interface';
import { TimerManagerService } from 'src/timer-manager/timer-manager.service';

@Controller()
export class DeviceControlController {
  private readonly logger = new Logger(DeviceControlController.name);

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
