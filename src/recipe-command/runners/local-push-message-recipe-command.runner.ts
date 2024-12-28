import { Injectable } from '@nestjs/common';
import {
  RecipeCommand,
  RecipeCommandPlatform,
} from '../entities/recipe-command.entity';

import { ICommandRunner } from './command-runner.interface';
import { RecipeRunner } from './runner.registry';
import { RunnerContext } from './runner-context';
import { LocalPushMessageRecipeCommand } from '../entities/child-recipe-command';
import { PushMessagingService } from '../../push-messaging/push-messaging.service';

@Injectable()
@RecipeRunner()
export class LocalPushMessageRecipeCommandRunner implements ICommandRunner {
  constructor(private readonly pushMessagingService: PushMessagingService) {}
  canHandle(command: RecipeCommand): boolean {
    return command.platform === RecipeCommandPlatform.LOCAL_PUSH_MESSAGE;
  }

  async execute(context: RunnerContext): Promise<void> {
    const recipeCommand =
      context.recipeCommand as LocalPushMessageRecipeCommand;
    await this.pushMessagingService.sendMessage(
      recipeCommand.title,
      recipeCommand.body,
    );
  }
}
