import { RecipeCondition } from '../entities/recipe-condition.entity';

export class ValidationContext {
  constructor(
    public readonly condition: RecipeCondition,
    private readonly additionalData: Record<string, any> = {},
  ) {}

  getValue<T>(key: string): T {
    return this.additionalData[key];
  }

  hasValue(key: string): boolean {
    return key in this.additionalData;
  }
}
