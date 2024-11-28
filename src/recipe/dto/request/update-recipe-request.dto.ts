import { PartialType } from '@nestjs/mapped-types';
import { CreateRecipeRequestDto } from './create-recipe-request.dto';

export class UpdateRecipeRequestDto extends PartialType(
  CreateRecipeRequestDto,
) {}
