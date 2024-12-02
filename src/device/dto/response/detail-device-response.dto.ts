import { RoomDto } from '../../../room/dto/room.dto';
import { DeviceDto } from '../device.dto';
import { MessageTemplateResponseDto } from '../../../message-template/dto/response/message-template-response.dto';
import { Type } from 'class-transformer';

export class DetailDeviceResponseDto extends DeviceDto {
  @Type(() => RoomDto)
  room?: RoomDto;

  @Type(() => MessageTemplateResponseDto)
  messageTemplates?: MessageTemplateResponseDto[];

  get state() {
    if (this._state === '') return this._state;

    return JSON.parse(this._state);
  }
}
