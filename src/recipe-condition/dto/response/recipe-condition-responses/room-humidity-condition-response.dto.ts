import { ApiProperty } from '@nestjs/swagger';
import { RoomHumidityConditionDto } from '../../recipe-conditions/room-humidity-condition.dto';

export class RoomHumidityConditionResponseDto extends RoomHumidityConditionDto {
  @ApiProperty({
    description: '조건 아이디',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '순서',
    example: 0,
  })
  order: number = 0;
}
