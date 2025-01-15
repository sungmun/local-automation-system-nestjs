import { ApiProperty } from '@nestjs/swagger';
import { RecipeCommandDto } from './recipe-command.dto';
import { RecipeCommandPlatform } from '../entities/recipe-command.entity';

export class HejHomeRecipeCommandDto extends RecipeCommandDto {
  @ApiProperty({
    description: '명령 객체',
    example: { power: 'on', temperature: 25 },
  })
  command: object;

  @ApiProperty({
    description: '장치 ID',
    example: 'device123',
  })
  deviceId: string;

  @ApiProperty({
    description: '플랫폼',
    example: RecipeCommandPlatform.HEJ_HOME,
  })
  platform: RecipeCommandPlatform.HEJ_HOME;
}
