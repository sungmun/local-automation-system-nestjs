import { Injectable } from '@nestjs/common';
import {
  RecipeCommand,
  RecipeCommandPlatform,
} from '../entities/recipe-command.entity';

import { ICommandRunner } from './command-runner.interface';
import { RecipeRunner } from './runner.registry';
import { RunnerContext } from './runner-context';
import { HejHomeRecipeCommand } from '../entities/child-recipe-command/hej-home-recipe-command.entity';
import { HejhomeApiService } from '../../hejhome-api/hejhome-api.service';

@Injectable()
@RecipeRunner()
export class HejHomeRecipeCommandRunner implements ICommandRunner {
  constructor(private readonly hejhomeApiService: HejhomeApiService) {}
  canHandle(command: RecipeCommand): boolean {
    return command.platform === RecipeCommandPlatform.HEJ_HOME;
  }

  async execute(context: RunnerContext): Promise<void> {
    const recipeCommand = context.recipeCommand as HejHomeRecipeCommand;

    await this.hejhomeApiService.setDeviceControl(recipeCommand.deviceId, {
      requirments: recipeCommand.command,
    });
  }
}
