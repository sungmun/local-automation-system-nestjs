import { ApiProperty } from '@nestjs/swagger';
import { RoomDto } from '../room.dto';
import { Type } from 'class-transformer';

export class ListRoomResponseDto {
  @ApiProperty({
    description: '방 목록',
    type: [RoomDto],
  })
  @Type(() => RoomDto)
  list: RoomDto[];
}
