import { ApiProperty } from '@nestjs/swagger';
import { ReserveTimeConditionDto } from '../reserve-time-condition.dto';

export class ReserveTimeConditionResponseDto extends ReserveTimeConditionDto {
  @ApiProperty({
    description: '조건 아이디',
    example: 1,
  })
  id: number;
}
