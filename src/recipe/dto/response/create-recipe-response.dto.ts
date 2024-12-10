import { RecipeConditionGroupResponseDto } from '../../../recipe-condition/dto/response/recipe-condition-group-response.dto';
import { DeviceCommandResponseDto } from './device-command-response.dto';
import { RecipeDto } from '../recipe.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecipeResponseDto extends RecipeDto {
  @ApiProperty({
    description: '레시피 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '장치 명령 목록',
    type: [DeviceCommandResponseDto],
  })
  deviceCommands: DeviceCommandResponseDto[];

  @ApiProperty({
    description: '레시피 조건 그룹 목록',
    type: [RecipeConditionGroupResponseDto],
  })
  recipeGroups: RecipeConditionGroupResponseDto[];
}
