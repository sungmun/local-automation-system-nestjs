import { Type } from 'class-transformer';
import { MessageTemplateResponseDto } from './message-template-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ListMessageTemplateResponseDto {
  @ApiProperty({
    description: '메시지 템플릿 목록',
    type: [MessageTemplateResponseDto],
  })
  @Type(() => MessageTemplateResponseDto)
  list: MessageTemplateResponseDto[];
}
