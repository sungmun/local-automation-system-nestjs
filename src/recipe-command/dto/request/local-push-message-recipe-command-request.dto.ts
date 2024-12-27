import { IsNotEmpty, IsString } from 'class-validator';
import { LocalPushMessageRecipeCommandDto } from '../local-push-message-recipe-command.dto';

export class LocalPushMessageRecipeCommandRequestDto extends LocalPushMessageRecipeCommandDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}
