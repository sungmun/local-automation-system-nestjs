import { Controller, Get, Logger, Param, Put } from '@nestjs/common';
import { RoomCrudService } from './room-crud.service';
import { plainToInstance } from 'class-transformer';
import { ListRoomResponseDto } from './dto/response/list-room-response.dto';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RoomDto } from './dto/room.dto';

@ApiTags('방')
@Controller('/rooms')
export class RoomController {
  private readonly logger = new Logger(RoomController.name);
  constructor(private readonly roomCrudService: RoomCrudService) {}

  @ApiOperation({ summary: '방 목록 조회' })
  @ApiOkResponse({
    description: '모든 방 목록을 반환합니다.',
    type: ListRoomResponseDto,
  })
  @Get()
  async findAll() {
    const rooms = await this.roomCrudService.findAll();
    return plainToInstance(ListRoomResponseDto, { list: rooms });
  }

  @ApiOperation({ summary: '방 활성화 상태 변경' })
  @ApiParam({
    name: 'roomId',
    description: '방 ID',
    type: 'number',
  })
  @ApiOkResponse({
    description: '변경된 방 정보를 반환합니다.',
    type: RoomDto,
  })
  @Put('/:roomId/active')
  async setActiveRoom(@Param('roomId') roomId: number) {
    await this.roomCrudService.setRoomActiveById(roomId);
    return this.roomCrudService.getRoomById(roomId);
  }
}
