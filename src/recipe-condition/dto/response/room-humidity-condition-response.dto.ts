import { ApiProperty } from '@nestjs/swagger';
import { RoomHumidityConditionDto } from '../room-humidity-condition.dto';

export class RoomHumidityConditionResponseDto extends RoomHumidityConditionDto {
  @ApiProperty({
    description: '조건 아이디',
    example: 1,
  })
  id: number;
}
