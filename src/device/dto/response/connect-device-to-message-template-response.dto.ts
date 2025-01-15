import { Type } from 'class-transformer';
import { MessageTemplateResponseDto } from '../../../message-template/dto/response/message-template-response.dto';
import { DeviceDto } from '../device.dto';

export class ConnectDeviceToMessageTemplateResponseDto extends DeviceDto {
  @Type(() => MessageTemplateResponseDto)
  messageTemplates?: MessageTemplateResponseDto[];
}
