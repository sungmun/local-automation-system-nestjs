import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';

import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { RecipeCrudService } from './recipe-crud.service';
import { RecipeCommandService } from './recipe-command.service';

@Controller('recipe')
export class RecipeController {
  private readonly logger = new Logger(RecipeController.name);
  constructor(
    private readonly recipeCrudService: RecipeCrudService,
    private readonly recipeCommandService: RecipeCommandService,
  ) {}

  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipeCrudService.saveRecipe(createRecipeDto);
  }

  @Get()
  findAll() {
    return this.recipeCrudService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipeCrudService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipeCrudService.update(+id, updateRecipeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recipeCrudService.remove(+id);
  }

  @OnEvent('recipe.condition.check', { async: true })
  async recipeConditionCheck(data: any) {
    this.logger.log('recipeConditionCheck', data);
    const isRecipeCondition = await this.recipeCommandService.recipeCheck(
      data.recipeId,
    );
    this.logger.log('recipeConditionCheck run', isRecipeCondition);
    if (isRecipeCondition) {
      await this.recipeCommandService.runRecipe(data.recipeId);
    }
  }
}
