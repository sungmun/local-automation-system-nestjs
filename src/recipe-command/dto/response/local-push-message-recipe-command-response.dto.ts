import { LocalPushMessageRecipeCommandDto } from '../local-push-message-recipe-command.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LocalPushMessageRecipeCommandResponseDto extends LocalPushMessageRecipeCommandDto {
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
