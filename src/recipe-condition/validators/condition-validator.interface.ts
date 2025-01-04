import { RecipeCondition } from '../entities/recipe-condition.entity';
import { ValidationContext } from './validation-context';

export interface IConditionValidator {
  canHandle(condition: Pick<RecipeCondition, 'type'>): boolean;
  validate(context: ValidationContext): Promise<boolean>;
}
