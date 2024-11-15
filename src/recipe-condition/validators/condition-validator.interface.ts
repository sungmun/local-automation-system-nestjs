import { RecipeCondition } from '../entities/recipe-condition.entity';
import { ValidationContext } from './validation-context';

export interface IConditionValidator {
  canHandle(condition: RecipeCondition): boolean;
  validate(context: ValidationContext): Promise<boolean>;
}
