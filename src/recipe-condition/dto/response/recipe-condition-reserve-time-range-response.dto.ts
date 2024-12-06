import { ApiProperty } from '@nestjs/swagger';
import { RecipeConditionReserveTimeRangeDto } from '../recipe-condition-reserve-time-range.dto';

export class RecipeConditionReserveTimeRangeResponseDto extends RecipeConditionReserveTimeRangeDto {
  @ApiProperty({
    description: '조건 아이디',
    example: 1,
  })
  id: number;
}
