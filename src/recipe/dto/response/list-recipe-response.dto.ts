import { Type } from 'class-transformer';
import { RecipeDto } from '../recipe.dto';
import { ApiProperty } from '@nestjs/swagger';

class SimpleRecipeResponseDto extends RecipeDto {
  @ApiProperty({
    description: '레시피 ID',
    example: 1,
  })
  id: number;
}
export class RecipeListResponseDto {
  @ApiProperty({
    description: '레시피 목록',
    type: [SimpleRecipeResponseDto],
  })
  @Type(() => SimpleRecipeResponseDto)
  list: SimpleRecipeResponseDto[];
}
