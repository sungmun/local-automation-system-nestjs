import { Inject, Injectable } from '@nestjs/common';

import { ICommandRunner } from './command-runner.interface';
import { RecipeCommand } from '../entities/recipe-command.entity';

@Injectable()
export class CommandRunnerFactory {
  constructor(
    @Inject('COMMAND_RUNNERS')
    private readonly runners: ICommandRunner[],
  ) {}

  getRunner(recipeCommand: RecipeCommand): ICommandRunner {
    const runner = this.runners.find((v) => v.canHandle(recipeCommand));
    if (!runner) {
      throw new Error(
        `No runner found for recipeCommand platform: ${recipeCommand.platform}`,
      );
    }
    return runner;
  }
}
