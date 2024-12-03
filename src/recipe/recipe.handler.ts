import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RecipeCommandService } from './recipe-command.service';

@Injectable()
export class RecipeHandler {
  private readonly logger = new Logger(RecipeHandler.name);

  constructor(private readonly recipeCommandService: RecipeCommandService) {}

  @OnEvent('recipe.condition.check', { async: true })
  async recipeConditionCheck(data: any): Promise<void> {
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
