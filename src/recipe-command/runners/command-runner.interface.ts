import { RecipeCommand } from '../entities/recipe-command.entity';
import { RunnerContext } from './runner-context';

export interface ICommandRunner {
  canHandle(command: RecipeCommand): boolean;
  execute(context: RunnerContext): Promise<void>;
}
