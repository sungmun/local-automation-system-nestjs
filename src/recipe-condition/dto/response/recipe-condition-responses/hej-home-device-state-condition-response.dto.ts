import { ApiProperty } from '@nestjs/swagger';
import { HejHomeDeviceStateConditionDto } from '../../recipe-conditions/hej-home-device-state-condition.dto';

export class HejHomeDeviceStateConditionResponseDto extends HejHomeDeviceStateConditionDto {
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
