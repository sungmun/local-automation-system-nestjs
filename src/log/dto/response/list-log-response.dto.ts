import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { LogDto } from '../log.dto';

export class LogResponseDto extends LogDto {
  @ApiProperty({
    description: '로그 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '생성 시간',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '로그 메시지',
    example:
      'DEVICE_AUTO_CHANGE - <[IrAirconditioner](device123) / {"power":"켜짐"}>',
  })
  logMessage: string;
}

export class ListLogResponseDto {
  @ApiProperty({
    description: '로그 목록',
    type: [LogResponseDto],
  })
  @Type(() => LogResponseDto)
  list: LogResponseDto[];
}
