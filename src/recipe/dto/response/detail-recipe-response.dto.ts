import { LocalTimerRecipeCommandResponseDto } from '../../../recipe-command/dto/response/local-timer-recipe-command-response.dto';
import {
  HejHomeRecipeCommandResponseDto,
  LocalPushMessageRecipeCommandResponseDto,
} from '../../../recipe-command/dto/response';
import { RecipeCommandResponseDto } from '../../../recipe-command/dto/response/recipe-command-response.dto';
import { RecipeConditionGroupResponseDto } from '../../../recipe-condition/dto/response/recipe-condition-group-response.dto';
import { RecipeDto } from '../recipe.dto';
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';

@ApiExtraModels(RecipeCommandResponseDto)
@ApiExtraModels(
  HejHomeRecipeCommandResponseDto,
  LocalTimerRecipeCommandResponseDto,
  LocalPushMessageRecipeCommandResponseDto,
)
export class DetailRecipeResponseDto extends RecipeDto {
  @ApiProperty({
    description: '레시피 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '명령 목록',
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(HejHomeRecipeCommandResponseDto) },
        { $ref: getSchemaPath(LocalTimerRecipeCommandResponseDto) },
        { $ref: getSchemaPath(LocalPushMessageRecipeCommandResponseDto) },
      ],
    },
  })
  recipeCommands: RecipeCommandResponseDto[];

  @ApiProperty({
    description: '레시피 조건 그룹 목록',
    type: [RecipeConditionGroupResponseDto],
  })
  recipeGroups: RecipeConditionGroupResponseDto[];
}
