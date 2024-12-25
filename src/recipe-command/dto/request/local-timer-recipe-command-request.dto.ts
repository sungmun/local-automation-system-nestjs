import { LocalTimerRecipeCommandDto } from '../local-timer-recipe-command.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LocalTimerRecipeCommandRequestDto extends LocalTimerRecipeCommandDto {
  @IsNumber()
  @IsNotEmpty()
  delayTime: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
