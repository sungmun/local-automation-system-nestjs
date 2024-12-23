import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { FindOptionsRelations, FindOptionsWhere } from 'typeorm';
import { Recipe } from './entities/recipe.entity';

import { instanceToPlain } from 'class-transformer';
import { CreateRecipeRequestDto } from './dto/request/create-recipe-request.dto';
import { UpdateRecipeRequestDto } from './dto/request/update-recipe-request.dto';
import { RecipeCommandService } from '../recipe-command/recipe-command.service';

@Injectable()
export class RecipeCrudService {
  private readonly logger = new Logger(RecipeCrudService.name);
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    private recipeCommandService: RecipeCommandService,
  ) {}

  async saveRecipe(createRecipeDto: CreateRecipeRequestDto) {
    const recipeCommands = await this.recipeCommandService.createRecipeCommands(
      createRecipeDto.recipeCommands,
    );

    return this.recipeRepository.save({
      ...createRecipeDto,
      recipeCommands,
    });
  }

  async findAll() {
    return this.recipeRepository.find();
  }

  async findOne(id: number) {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: ['deviceCommands', 'recipeGroups', 'recipeGroups.conditions'],
    });

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    return recipe;
  }

  async update(id: number, updateRecipeDto: UpdateRecipeRequestDto) {
    const { recipeCommands, recipeGroups, ...updateRecipe } =
      instanceToPlain(updateRecipeDto);

    if (!recipeCommands && !recipeGroups) {
      const result = await this.recipeRepository.update(id, updateRecipe);
      if (result.affected < 1) {
        throw new NotFoundException(`Recipe with ID ${id} not found`);
      }
      return;
    }
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: {
        recipeCommands: true,
        recipeGroups: { conditions: true },
      },
    });

    if (recipe === null) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    if (recipeCommands) {
      recipe.recipeCommands =
        await this.recipeCommandService.createRecipeCommands(recipeCommands);
    }

    if (recipeGroups) {
      recipe.recipeGroups = recipeGroups;
    }

    await this.recipeRepository.save({ ...recipe, ...updateRecipe });
  }

  async remove(id: number) {
    return this.recipeRepository.delete(id);
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<Recipe>,
    findOptionsRelation: FindOptionsRelations<Recipe>,
    updateSet: Partial<Recipe>,
  ) {
    const updateResult = await this.recipeRepository.update(where, updateSet);
    if (updateResult.affected < 1) {
      throw new NotFoundException(
        `Recipe with where ${JSON.stringify(where)} not found`,
      );
    }

    return this.recipeRepository.findOne({
      where,
      relations: findOptionsRelation,
    });
  }
}
