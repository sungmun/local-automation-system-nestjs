import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RecipeService } from './recipe.service';

@Injectable()
export class RecipeHandler {
  private readonly logger = new Logger(RecipeHandler.name);

  constructor(private readonly recipeService: RecipeService) {}

  @OnEvent('recipe.condition.check', { async: true })
  async recipeConditionCheck(data: any): Promise<void> {
    this.logger.log('recipeConditionCheck', data);
    const isRecipeCondition = await this.recipeService.recipeCheck(
      data.recipeId,
    );
    this.logger.log('recipeConditionCheck run', isRecipeCondition);
    if (isRecipeCondition) {
      await this.recipeService.runRecipe(data.recipeId);
    }
  }
}
