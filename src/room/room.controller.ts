import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import { UpdateRoomDto } from './dto/updateRoom.dto';
import { RoomCrudService } from './room-crud.service';

@Controller('/rooms')
export class RoomController {
  private readonly logger = new Logger(RoomController.name);
  constructor(private readonly roomCrudService: RoomCrudService) {}

  @Get()
  async findAll() {
    return this.roomCrudService.findAll();
  }

  @Put('/:roomId/active')
  async setActiveRoom(@Param('roomId') roomId: number) {
    await this.roomCrudService.setRoomActiveById(roomId);
    return this.roomCrudService.getRoomById(roomId);
  }

  @Patch('/:roomId')
  async setRoom(
    @Param('roomId') roomId: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    await this.roomCrudService.setRoomById(roomId, updateRoomDto);
    return this.roomCrudService.getRoomById(roomId);
  }
}
