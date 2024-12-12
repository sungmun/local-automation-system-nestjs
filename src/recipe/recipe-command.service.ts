import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './entities/recipe.entity';

import { HejhomeApiService } from './../hejhome-api/hejhome-api.service';
import { TimerManagerService } from './../timer-manager/timer-manager.service';
import { RecipeConditionService } from './../recipe-condition/recipe-condition.service';

import { DeviceCommand } from './entities/device-command.entity';
import {
  DeviceCommandParseException,
  RecipeInactiveException,
  RecipeNotFoundException,
} from './recipe.exception';

@Injectable()
export class RecipeCommandService {
  private readonly logger = new Logger(RecipeCommandService.name);

  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    private hejhomeApiService: HejhomeApiService,
    private timerManagerService: TimerManagerService,
    private recipeConditionService: RecipeConditionService,
  ) {}

  async runRecipe(id: number): Promise<void> {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: ['deviceCommands'],
    });

    if (!recipe) {
      throw new RecipeNotFoundException(id);
    }

    if (!recipe.active) {
      throw new RecipeInactiveException(id);
    }

    await this.executeRecipe(recipe);
  }

  private async executeRecipe(recipe: Recipe): Promise<void> {
    const { deviceCommands, timer } = recipe;

    if (timer !== -1) {
      const hasTimer = this.timerManagerService.setTimer(
        `recipe-${recipe.id}`,
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

  private async runDeviceCommands(
    deviceCommands: DeviceCommand[],
  ): Promise<void> {
    for (const deviceCommand of deviceCommands) {
      await this.executeDeviceCommand(deviceCommand);
    }
  }

  private async executeDeviceCommand(
    deviceCommand: DeviceCommand,
  ): Promise<void> {
    try {
      this.logger.debug(
        `장치 ${deviceCommand.deviceId} 명령 실행: ${JSON.stringify(deviceCommand.command)}`,
      );
      await this.hejhomeApiService.setDeviceControl(deviceCommand.deviceId, {
        requirments: deviceCommand.command,
      });
    } catch (error) {
      this.logger.error(
        `장치 명령 실행 실패: ${deviceCommand.deviceId}`,
        error,
      );
      throw error;
    }
  }

  private parseCommand(command: string): unknown {
    try {
      return JSON.parse(command);
    } catch (error) {
      this.logger.error(`명령어 파싱 실패: ${command}`);
      throw new DeviceCommandParseException(command);
    }
  }

  async recipeCheck(recipeId: number): Promise<boolean> {
    const recipe = await this.recipeRepository.findOne({
      where: { active: true, id: recipeId },
      relations: [
        'recipeGroups',
        'recipeGroups.conditions',
        'recipeGroups.conditions.room',
      ],
    });

    if (!recipe) {
      throw new RecipeNotFoundException(recipeId);
    }

    return this.recipeConditionService.checkRecipeConditions(
      recipe.recipeGroups,
    );
  }
}
