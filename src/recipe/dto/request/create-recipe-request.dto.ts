import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';

import { CreateRecipeConditionGroupRequestDto } from '../../../recipe-condition/dto/request/create-condition-group-request.dto';
import { RecipeDto } from '../recipe.dto';
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { RecipeCommandRequestDto } from '../../../recipe-command/dto/request/recipe-command-request.dto';
import { HejHomeRecipeCommandRequestDto } from '../../../recipe-command/dto/request/hej-home-recipe-command-request.dto';
import { RecipeCommandPlatform } from '../../../recipe-command/entities/recipe-command.entity';
import { LocalTimerRecipeCommandRequestDto } from '../../../recipe-command/dto/request/local-timer-recipe-command-request.dto';

@ApiExtraModels(
  HejHomeRecipeCommandRequestDto,
  LocalTimerRecipeCommandRequestDto,
)
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
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(HejHomeRecipeCommandRequestDto) },
        { $ref: getSchemaPath(LocalTimerRecipeCommandRequestDto) },
      ],
    },
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeCommandRequestDto, {
    keepDiscriminatorProperty: false,
    discriminator: {
      property: 'platform',
      subTypes: [
        {
          value: HejHomeRecipeCommandRequestDto,
          name: RecipeCommandPlatform.HEJ_HOME,
        },
        {
          value: LocalTimerRecipeCommandRequestDto,
          name: RecipeCommandPlatform.LOCAL_TIMER,
        },
      ],
    },
  })
  recipeCommands: RecipeCommandRequestDto[];

  @ApiProperty({
    description: '레시피 조건 그룹 목록',
    type: [CreateRecipeConditionGroupRequestDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeConditionGroupRequestDto)
  recipeGroups: CreateRecipeConditionGroupRequestDto[];
}
