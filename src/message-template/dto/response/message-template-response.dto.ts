import { MessageTemplateDto } from '../message-template.dto';

export class MessageTemplateResponseDto extends MessageTemplateDto {
  id: string;

  createdAt: Date;

  updatedAt: Date;
}
