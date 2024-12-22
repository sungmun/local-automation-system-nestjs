import { ApiProperty } from '@nestjs/swagger';
import { RecipeCommandPlatform } from '../entities/recipe-command.entity';

export class RecipeCommandDto {
  @ApiProperty({
    description: '명령 이름',
    example: '에어컨 켜기',
  })
  name: string;

  @ApiProperty({
    description: '플랫폼',
    example: RecipeCommandPlatform.HEJ_HOME,
  })
  platform: RecipeCommandPlatform;
}
