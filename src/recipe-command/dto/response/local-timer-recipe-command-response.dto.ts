import { ApiProperty } from '@nestjs/swagger';
import { LocalTimerRecipeCommandDto } from '../local-timer-recipe-command.dto';

export class LocalTimerRecipeCommandResponseDto extends LocalTimerRecipeCommandDto {
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
