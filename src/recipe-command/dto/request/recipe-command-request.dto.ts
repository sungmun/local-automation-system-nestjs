import { IsIn, IsNotEmpty } from 'class-validator';
import { RecipeCommandPlatform } from '../../entities/recipe-command.entity';
import { RecipeCommandDto } from '../recipe-command.dto';

export class RecipeCommandRequestDto extends RecipeCommandDto {
  @IsIn(Object.values(RecipeCommandPlatform))
  @IsNotEmpty()
  platform: RecipeCommandPlatform;
}
