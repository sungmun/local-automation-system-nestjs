import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Recipe, RecipeStatus } from './entities/recipe.entity';
import { DeviceCommand } from './entities/device-command.entity';

import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';
import { TimerManagerService } from '../timer-manager/timer-manager.service';
import { RecipeConditionService } from '../recipe-condition/recipe-condition.service';
import { RecipeCrudService } from './recipe-crud.service';

@Injectable()
export class RecipeService {
  private readonly logger = new Logger(RecipeService.name);
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    private hejhomeApiService: HejhomeApiService,
    private timerManagerService: TimerManagerService,
    private recipeConditionService: RecipeConditionService,
    private recipeCrudService: RecipeCrudService,
  ) {}

  async runDeviceCommands(deviceCommands: DeviceCommand[]) {
    for (const deviceCommand of deviceCommands) {
      this.logger.debug(
        `Running command for device ${deviceCommand.deviceId}: ${JSON.stringify(deviceCommand.command)}`,
      );
      await this.hejhomeApiService.setDeviceControl(deviceCommand.deviceId, {
        requirments: deviceCommand.command,
      });
    }
  }

  async runRecipe(id: number): Promise<void> {
    const recipe = await this.recipeCrudService.findOneAndUpdate(
      { id, status: Not(RecipeStatus.RUNNING), active: true },
      { deviceCommands: true },
      { status: RecipeStatus.RUNNING },
    );

    const { deviceCommands, timer } = recipe;

    if (timer !== -1) {
      const hasTimer = this.timerManagerService.setTimer(
        `recipe-${id}`,
        () => this.runDeviceCommands(deviceCommands),
        timer,
      );
      if (!hasTimer) {
        await this.runDeviceCommands(deviceCommands);
      }
    } else {
      await this.runDeviceCommands(deviceCommands);
    }
  }

  async recipeCheck(recipeId: number) {
    const recipe = await this.recipeRepository.findOne({
      where: { active: true, id: recipeId },
      relations: ['recipeGroups', 'recipeGroups.conditions'],
    });

    if (!recipe) return;

    return this.recipeConditionService.checkRecipeConditions(
      recipe.recipeGroups,
    );
  }
}
