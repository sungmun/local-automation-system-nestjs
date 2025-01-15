import { ApiProperty } from '@nestjs/swagger';
import { MessageTemplateDto } from '../message-template.dto';

export class MessageTemplateResponseDto extends MessageTemplateDto {
  @ApiProperty({
    description: '메시지 템플릿 ID',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: '메시지 템플릿 생성일',
    example: '2024-01-01',
  })
  createdAt: Date;

  @ApiProperty({
    description: '메시지 템플릿 수정일',
    example: '2024-01-01',
  })
  updatedAt: Date;
}
