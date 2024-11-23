import { IsNotEmpty, IsDate } from 'class-validator';
import { BaseRecipeConditionDto } from './base-recipe-condition.dto';
import { TransformDate } from '../../common/decorators/transform-date.decorator';

export class ReserveTimeConditionDto extends BaseRecipeConditionDto {
  @IsNotEmpty()
  @IsDate()
  @TransformDate()
  reserveTime: Date;
}
