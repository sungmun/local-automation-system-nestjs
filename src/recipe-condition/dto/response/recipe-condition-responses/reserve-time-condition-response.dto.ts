import { ApiProperty } from '@nestjs/swagger';
import { ReserveTimeConditionDto } from '../../recipe-conditions/reserve-time-condition.dto';

export class ReserveTimeConditionResponseDto extends ReserveTimeConditionDto {
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
