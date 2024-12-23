import { HejHomeRecipeCommandDto } from '../hej-home-recipe-command.dto';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class HejHomeRecipeCommandRequestDto extends HejHomeRecipeCommandDto {
  @IsObject()
  @IsNotEmpty()
  command: object;

  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
