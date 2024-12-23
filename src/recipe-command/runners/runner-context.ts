import { RecipeCommand } from '../entities/recipe-command.entity';

export class RunnerContext {
  constructor(
    public readonly recipeCommand: RecipeCommand,
    private readonly additionalData: Record<string, any> = {},
  ) {}

  getValue<T>(key: string): T {
    return this.additionalData[key];
  }

  hasValue(key: string): boolean {
    return key in this.additionalData;
  }
}
