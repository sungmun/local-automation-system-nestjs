import { RecipeCommandResponseDto } from '../../../recipe-command/dto/response/recipe-command-response.dto';
import { RecipeConditionGroupResponseDto } from '../../../recipe-condition/dto/response/recipe-condition-group-response.dto';
import { RecipeDto } from '../recipe.dto';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

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
      oneOf: [{ $ref: getSchemaPath(RecipeCommandResponseDto) }],
    },
  })
  recipeCommands: RecipeCommandResponseDto[];

  @ApiProperty({
    description: '레시피 조건 그룹 목록',
    type: [RecipeConditionGroupResponseDto],
  })
  recipeGroups: RecipeConditionGroupResponseDto[];
}
