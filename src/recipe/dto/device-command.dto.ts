import { ApiProperty } from '@nestjs/swagger';

export class DeviceCommandDto {
  @ApiProperty({
    description: '장치 명령 객체',
    example: { power: 'on', temperature: 25 },
  })
  command: object;

  @ApiProperty({
    description: '장치 ID',
    example: 'device123',
  })
  deviceId: string;

  @ApiProperty({
    description: '명령 이름',
    example: '에어컨 켜기',
  })
  name: string;
}
