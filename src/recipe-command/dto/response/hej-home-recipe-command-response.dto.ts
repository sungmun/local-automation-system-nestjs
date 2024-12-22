import { ApiProperty } from '@nestjs/swagger';

import { HejHomeRecipeCommandDto } from '../hej-home-recipe-command.dto';

export class HejHomeRecipeCommandResponseDto extends HejHomeRecipeCommandDto {
  @ApiProperty({
    description: '장치 명령 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '장치 명령 순서',
    example: 1,
  })
  order: number;
}
