import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { CreateDeviceCommandRequestDto } from './create-device-command-request.dto';
import { CreateRecipeConditionGroupRequestDto } from '../../../recipe-condition/dto/request/create-condition-group-request.dto';
import { RecipeDto } from '../recipe.dto';

export class CreateRecipeRequestDto extends RecipeDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsBoolean()
  active: boolean = true;

  @IsNumber()
  timer: number = -1;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDeviceCommandRequestDto)
  deviceCommands: CreateDeviceCommandRequestDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeConditionGroupRequestDto)
  recipeGroups: CreateRecipeConditionGroupRequestDto[];
}
