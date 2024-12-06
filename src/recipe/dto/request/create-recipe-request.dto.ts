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
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({
    description: '장치 명령 목록',
    type: [CreateDeviceCommandRequestDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDeviceCommandRequestDto)
  deviceCommands: CreateDeviceCommandRequestDto[];

  @ApiProperty({
    description: '레시피 조건 그룹 목록',
    type: [CreateRecipeConditionGroupRequestDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeConditionGroupRequestDto)
  recipeGroups: CreateRecipeConditionGroupRequestDto[];
}
