import { BaseRecipeConditionDto } from '../base-recipe-condition.dto';
import { RecipeConditionType } from '../../entities/recipe-condition.entity';
import { ApiProperty } from '@nestjs/swagger';

export class StatusDelayMaintainConditionDto extends BaseRecipeConditionDto {
  @ApiProperty({
    description: '조건 타입',
    enum: RecipeConditionType,
    example: RecipeConditionType.STATUS_DELAY_MAINTAIN,
  })
  type: RecipeConditionType.STATUS_DELAY_MAINTAIN;

  @ApiProperty({
    description: '지연 시간(초)',
    example: 60,
  })
  delayTime: number;
}
