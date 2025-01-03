import { ApiProperty } from '@nestjs/swagger';
import { ReserveTimeRangeConditionDto } from '../../recipe-conditions/reserve-time-range-condition.dto';

export class ReserveTimeRangeConditionResponseDto extends ReserveTimeRangeConditionDto {
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
