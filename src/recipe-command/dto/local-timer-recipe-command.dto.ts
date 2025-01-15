import { ApiProperty } from '@nestjs/swagger';
import { RecipeCommandDto } from './recipe-command.dto';
import { RecipeCommandPlatform } from '../entities/recipe-command.entity';

export class LocalTimerRecipeCommandDto extends RecipeCommandDto {
  @ApiProperty({
    description: '지연 시간(분)',
    example: 10,
  })
  delayTime: number;

  @ApiProperty({
    description: '플랫폼',
    example: RecipeCommandPlatform.LOCAL_TIMER,
  })
  platform: RecipeCommandPlatform.LOCAL_TIMER;
}
