import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './entities/recipe.entity';
import { DeviceCommand } from './entities/device-command.entity';

import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';
import { TimerManagerService } from '../timer-manager/timer-manager.service';
import { RecipeConditionService } from '../recipe-condition/recipe-condition.service';

@Injectable()
export class RecipeService {
  private readonly logger = new Logger(RecipeService.name);
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    private hejhomeApiService: HejhomeApiService,
    private timerManagerService: TimerManagerService,
    private recipeConditionService: RecipeConditionService,
  ) {}

  async runDeviceCommands(deviceCommands: DeviceCommand[]) {
    return deviceCommands.reduce((acc, deviceCommand) => {
      return acc.then(async () => {
        this.logger.debug(
          `Running command for device ${deviceCommand.deviceId}: ${JSON.stringify(deviceCommand.command)}`,
        );
        await this.hejhomeApiService.setDeviceControl(deviceCommand.deviceId, {
          requirments: deviceCommand.command,
        });
      });
    }, Promise.resolve());
  }

  async runRecipe(id: number) {
    const recipe = await this.recipeRepository.findOne({
      where: { id, active: true },
      relations: ['deviceCommands'],
    });

    if (!recipe) {
      this.logger.warn(`Recipe ${id} not found or inactive`);
      return;
    }

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
