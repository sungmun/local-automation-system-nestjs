import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RoomService } from './room.service';
import { ResponseSensorTHState } from '../hejhome-api/hejhome-api.interface';
import { RoomSensorService } from './room-sensor.service';

@Injectable()
export class RoomHandler {
  private readonly logger = new Logger(RoomHandler.name);

  constructor(
    private readonly roomService: RoomService,
    private readonly roomSensorService: RoomSensorService,
  ) {}

  @OnEvent('finish.SensorTh.*')
  async handleTemperatureFinish(state: ResponseSensorTHState) {
    this.logger.debug('handleTemperatureFinish', state);
    await this.roomService.activeRoomRecipe(state.id);
  }

  @OnEvent('changed.SensorTh.*')
  async handleTemperatureOrHumidityChange(state: ResponseSensorTHState) {
    const { id, deviceState } = state;
    await this.roomSensorService.updateRoomBySensorId(id, {
      humidity: deviceState.humidity,
      temperature: deviceState.temperature,
    });
  }
}
