import { ApiProperty } from '@nestjs/swagger';
import { DeviceCommandDto } from '../device-command.dto';

export class DeviceCommandResponseDto extends DeviceCommandDto {
  @ApiProperty({
    description: '장치 명령 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '장치 플랫폼',
    example: 'hejhome',
  })
  platform: string;

  @ApiProperty({
    description: '장치 명령 순서',
    example: 1,
  })
  order: number;
}
