import {
  ValidateNested,
  IsNotEmpty,
  IsBoolean,
  IsArray,
  IsString,
  IsNumber,
} from 'class-validator';
import { CreateDeviceCommandDto } from './create-device-command.dto';
import { Type } from 'class-transformer';
import { CreateRecipeConditionGroupDto } from './create-condition-group.dto';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

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
  @Type(() => CreateDeviceCommandDto)
  deviceCommands: CreateDeviceCommandDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeConditionGroupDto)
  recipeGroups: CreateRecipeConditionGroupDto[];
}
