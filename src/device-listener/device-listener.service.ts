import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
  ResponseIrAirconditionerStatus,
  ResponseSensorTHStatus,
} from 'src/hejhome-api/hejhome-api.interface';

@Injectable()
export class DeviceListenerService {
  private readonly logger = new Logger(DeviceListenerService.name);
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @OnEvent('IrAirconditioner.*', { async: true })
  async IrAirconditionerEvent(status: ResponseIrAirconditionerStatus) {
    this.logger.debug('IrAirconditionerEvent', status);
  }

  @OnEvent('SensorTh.*', { async: true })
  async SensorThEvent(status: ResponseSensorTHStatus) {
    this.logger.debug('SensorTh', status);
  }
}
