import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import * as ResponseDtos from './recipe-condition-responses';
import { RecipeConditionGroupDto } from '../recipe-condition-group.dto';

@ApiExtraModels(...Object.values(ResponseDtos))
export class RecipeConditionGroupResponseDto extends RecipeConditionGroupDto {
  @ApiProperty({
    description: '그룹 아이디',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '레시피 조건 목록',
    type: 'array',
    items: {
      oneOf: Object.values(ResponseDtos).map((dto) => ({
        $ref: getSchemaPath(dto),
      })),
    },
  })
  conditions: InstanceType<(typeof ResponseDtos)[keyof typeof ResponseDtos]>[];
}
