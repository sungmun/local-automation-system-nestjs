import { Type } from 'class-transformer';
import { MessageTemplateResponseDto } from './message-template-response.dto';

export class ListMessageTemplateResponseDto {
  @Type(() => MessageTemplateResponseDto)
  list: MessageTemplateResponseDto[];
}
