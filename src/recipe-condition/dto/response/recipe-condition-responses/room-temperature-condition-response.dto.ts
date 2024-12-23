import { ApiProperty } from '@nestjs/swagger';
import { RoomTemperatureConditionDto } from '../../recipe-conditions/room-temperature-condition.dto';

export class RoomTemperatureConditionResponseDto extends RoomTemperatureConditionDto {
  @ApiProperty({
    description: '조건 아이디',
    example: 1,
  })
  id: number;
}
