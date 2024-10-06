import { Controller, Logger } from '@nestjs/common';
import { RoomService } from './room.service';
import { OnEvent } from '@nestjs/event-emitter';
import { ResponseSensorTHState } from '../hejhome-api/hejhome-api.interface';

@Controller()
export class RoomController {
  private readonly logger = new Logger(RoomController.name);
  constructor(private readonly roomService: RoomService) {}

  @OnEvent('SensorTh.*', { async: true })
  async setRoomTemperature(state: ResponseSensorTHState) {
    this.logger.debug('setRoomTemperature', state);
    const { id, deviceState } = state;
    await this.roomService.setRoomTemperature(id, deviceState.temperature);
  }
}
