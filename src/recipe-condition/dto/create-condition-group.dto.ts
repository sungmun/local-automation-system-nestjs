import { IsNotEmpty, IsIn, ValidateNested, IsArray } from 'class-validator';
import { CreateRecipeConditionDto } from './create-condition.dto';
import { Type } from 'class-transformer';

export class CreateRecipeConditionGroupDto {
  @IsIn(['AND', 'OR'])
  @IsNotEmpty()
  operator: 'AND' | 'OR';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeConditionDto)
  conditions: CreateRecipeConditionDto[];
}
