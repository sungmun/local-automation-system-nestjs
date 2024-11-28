import { IsNotEmpty, IsDate } from 'class-validator';
import { BaseRecipeConditionRequestDto } from './base-recipe-condition-request.dto';
import { TransformDate } from '../../../common/decorators/transform-date.decorator';

export class ReserveTimeConditionRequestDto extends BaseRecipeConditionRequestDto {
  @IsNotEmpty()
  @IsDate()
  @TransformDate()
  reserveTime: Date;
}
