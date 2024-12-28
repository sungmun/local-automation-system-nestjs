import { ApiProperty } from '@nestjs/swagger';
import { RecipeCommandDto } from './recipe-command.dto';
import { RecipeCommandPlatform } from '../entities/recipe-command.entity';

export class LocalPushMessageRecipeCommandDto extends RecipeCommandDto {
  @ApiProperty({
    description: '타이틀',
    example: '타이틀',
  })
  title: string;

  @ApiProperty({
    description: '메세지 본문',
    example: '테스트 메세지',
  })
  body: string;

  @ApiProperty({
    description: '플랫폼',
    example: RecipeCommandPlatform.LOCAL_PUSH_MESSAGE,
  })
  platform: RecipeCommandPlatform.LOCAL_PUSH_MESSAGE;
}
