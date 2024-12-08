import { RoomDto } from '../../../room/dto/room.dto';
import { DeviceDto } from '../device.dto';
import { MessageTemplateResponseDto } from '../../../message-template/dto/response/message-template-response.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DetailDeviceResponseDto extends DeviceDto {
  @ApiProperty({
    description: '방 정보',
    type: RoomDto,
  })
  @Type(() => RoomDto)
  room?: RoomDto;

  @ApiProperty({
    description: '메시지 템플릿 목록',
    type: [MessageTemplateResponseDto],
  })
  @Type(() => MessageTemplateResponseDto)
  messageTemplates?: MessageTemplateResponseDto[];

  get state() {
    if (this._state === '' || typeof this._state === 'object') {
      return this._state;
    }
    return JSON.parse(this._state);
  }
}
