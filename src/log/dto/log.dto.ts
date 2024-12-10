import { ApiProperty } from '@nestjs/swagger';

export class LogDto {
  @ApiProperty({
    description: '로그 타입',
    example: 'DEVICE_AUTO_CHANGE',
  })
  type: string;

  @ApiProperty({
    description: '장치 ID',
    example: 'device123',
    required: false,
  })
  deviceId?: string;

  @ApiProperty({
    description: '로그 메시지',
    example:
      'DEVICE_AUTO_CHANGE - <[IrAirconditioner](device123) / {"power":"켜짐"}>',
    required: false,
  })
  logMessage?: string;
}
