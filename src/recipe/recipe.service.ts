import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Recipe, RecipeStatus } from './entities/recipe.entity';
import { RecipeNotFoundException } from './recipe.exception';
import { RecipeCrudService } from './recipe-crud.service';
import { RecipeCommandService } from '../recipe-command/recipe-command.service';
import { RecipeConditionService } from '../recipe-condition/recipe-condition.service';

@Injectable()
export class RecipeService {
  private readonly logger = new Logger(RecipeService.name);

  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    private recipeConditionService: RecipeConditionService,
    private recipeCrudService: RecipeCrudService,
    private recipeCommandService: RecipeCommandService,
  ) {}

  async runRecipe(id: number): Promise<void> {
    const recipe = await this.recipeCrudService.findOneAndUpdate(
      { id, status: Not(RecipeStatus.RUNNING), active: true },
      { recipeCommands: true },
      { status: RecipeStatus.RUNNING },
    );

    await this.recipeCommandService
      .runCommands(recipe.recipeCommands)
      .finally(async () => {
        await this.recipeRepository.update(id, {
          status: RecipeStatus.STOPPED,
        });
      });
  }

  async recipeCheck(recipeId: number): Promise<boolean> {
    const recipe = await this.recipeRepository.findOne({
      where: { active: true, id: recipeId },
      relations: { recipeGroups: { conditions: true } },
      order: { recipeGroups: { conditions: { order: 'ASC' } } },
    });

    if (!recipe) {
      throw new RecipeNotFoundException(recipeId);
    }

    if (recipe.status === RecipeStatus.RUNNING) {
      return false;
    }

    return this.recipeConditionService.checkRecipeConditions(
      recipe.recipeGroups,
    );
  }
}
