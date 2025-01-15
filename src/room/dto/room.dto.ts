import { ApiProperty } from '@nestjs/swagger';

export class RoomDto {
  @ApiProperty({
    description: '방 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '방 이름',
    example: '거실',
  })
  name: string;

  @ApiProperty({
    description: '온도',
    example: 24.5,
    required: false,
  })
  temperature?: number;

  @ApiProperty({
    description: '습도',
    example: 50,
    required: false,
  })
  humidity?: number;

  @ApiProperty({
    description: '센서 ID',
    example: 'sensor-123',
    required: false,
  })
  sensorId?: string;

  @ApiProperty({
    description: '활성화 여부',
    example: true,
    required: false,
    default: false,
  })
  active?: boolean;
}
