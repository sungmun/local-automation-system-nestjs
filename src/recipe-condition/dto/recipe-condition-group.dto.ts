import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import * as RecipeConditions from './recipe-conditions';

@ApiExtraModels(...Object.values(RecipeConditions))
export class RecipeConditionGroupDto {
  @ApiProperty({
    description: '조건 연산자',
    example: 'AND',
    enum: ['AND', 'OR'],
  })
  operator: 'AND' | 'OR';

  @ApiProperty({
    description: '레시피 조건 목록',
    type: 'array',
    items: {
      oneOf: Object.values(RecipeConditions).map((dto) => ({
        $ref: getSchemaPath(dto),
      })),
    },
  })
  conditions: InstanceType<
    (typeof RecipeConditions)[keyof typeof RecipeConditions]
  >[];
}
