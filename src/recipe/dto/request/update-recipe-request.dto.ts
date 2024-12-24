import { CreateRecipeRequestDto } from './create-recipe-request.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateRecipeRequestDto extends PartialType(
  CreateRecipeRequestDto,
) {}
