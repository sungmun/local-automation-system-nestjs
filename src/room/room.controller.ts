import { Controller, Get, Logger, Param, Put } from '@nestjs/common';

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
}
