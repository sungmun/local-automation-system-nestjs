import { ApiProperty } from '@nestjs/swagger';

export class MessageTemplateDto {
  @ApiProperty({
    description: '메시지 템플릿 이름',
    example: '알림 템플릿',
  })
  name: string;

  @ApiProperty({
    description: '메시지 템플릿 본문',
    example: '알림 템플릿 본문',
  })
  body: string;

  @ApiProperty({
    description: '메시지 템플릿 제목',
    example: '알림 템플릿 제목',
  })
  title: string;

  @ApiProperty({
    description: '메시지 템플릿 타입',
    example: 'ALARM',
  })
  type: string;
}
