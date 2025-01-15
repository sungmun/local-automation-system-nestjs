import { Injectable, Logger } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { OnSafeEvent } from '../common/decorators/safe-event.decoratot';

@Injectable()
export class RecipeHandler {
  private readonly logger = new Logger(RecipeHandler.name);

  constructor(private readonly recipeService: RecipeService) {}

  @OnSafeEvent('recipe.condition.check', { async: true })
  async recipeConditionCheck(data: { recipeId: number }): Promise<void> {
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
