import { Injectable } from '@nestjs/common';
import {
  RecipeCommand,
  RecipeCommandPlatform,
} from '../entities/recipe-command.entity';

import { ICommandRunner } from './command-runner.interface';
import { RecipeRunner } from './runner.registry';
import { RunnerContext } from './runner-context';
import { LocalTimerRecipeCommand } from '../entities/child-recipe-command/local-timer-recipe-command.entity';
import { TimerManagerService } from '../../timer-manager/timer-manager.service';

@Injectable()
@RecipeRunner()
export class LocalTimerRecipeCommandRunner implements ICommandRunner {
  constructor(private readonly timerManagerService: TimerManagerService) {}
  canHandle(command: RecipeCommand): boolean {
    return command.platform === RecipeCommandPlatform.LOCAL_TIMER;
  }

  async execute(context: RunnerContext): Promise<void> {
    const recipeCommand = context.recipeCommand as LocalTimerRecipeCommand;

    await this.timerManagerService.promiseSetTimer(
      `recipe-command-${recipeCommand.id}`,
      recipeCommand.delayTime,
    );
  }
}
