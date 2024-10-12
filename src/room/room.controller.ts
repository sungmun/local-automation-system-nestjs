import { Body, Controller, Logger, Param, Patch, Put } from '@nestjs/common';
import { RoomService } from './room.service';
import { OnEvent } from '@nestjs/event-emitter';
import { ResponseSensorTHState } from '../hejhome-api/hejhome-api.interface';
import { UpdateRoomDto } from './dto/updateRoom.dto';

@Controller('/rooms')
export class RoomController {
  private readonly logger = new Logger(RoomController.name);
  constructor(private readonly roomService: RoomService) {}

  @OnEvent('changed.SensorTh.*', { async: true })
  async setRoomTemperature(state: ResponseSensorTHState) {
    this.logger.debug('setRoomTemperature', state);
    const { id, deviceState } = state;
    await this.roomService.setRoomTemperature(id, deviceState.temperature);
  }

  @Put('/:roomId/active')
  async setActiveRoom(@Param('roomId') roomId: number) {
    await this.roomService.setRoomActiveById(roomId);
    return this.roomService.getRoomById(roomId);
  }

  @Patch('/:roomId')
  async setRoom(
    @Param('roomId') roomId: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    await this.roomService.setRoomById(roomId, updateRoomDto);
    return this.roomService.getRoomById(roomId);
  }
}
