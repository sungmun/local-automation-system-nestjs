import { Injectable, Logger, NotAcceptableException } from '@nestjs/common';
import { RecipeCondition } from './entities/recipe-condition.entity';
import { Room } from '../room/entities/room.entity';
import { RecipeConditionGroup } from './entities/recipe-condition-group.entity';
import { ConditionValidatorFactory } from './validators/condition-validator.factory';
import { ValidationContext } from './validators/validation-context';

@Injectable()
export class RecipeConditionService {
  private readonly logger = new Logger(RecipeConditionService.name);

  constructor(
    private readonly conditionValidatorFactory: ConditionValidatorFactory,
  ) {}

  async checkRecipeConditions(
    recipeGroups: RecipeConditionGroup[],
  ): Promise<boolean> {
    try {
      await this.validateAllGroups(recipeGroups);
      return true;
    } catch (error) {
      this.handleError(error, recipeGroups);
      return false;
    }
  }

  private async validateAllGroups(
    groups: RecipeConditionGroup[],
  ): Promise<void> {
    for (const group of groups) {
      const results = await this.validateGroupConditions(group);
      this.validateGroupResults(group, results);
    }
  }

  private async validateGroupConditions(
    group: RecipeConditionGroup,
  ): Promise<boolean[]> {
    return Promise.all(
      group.conditions.map(async (condition) => {
        let room: Room;
        if ('room' in condition) {
          room = condition.room as Room;
        }

        return this.validate(condition, new ValidationContext(condition, room));
      }),
    );
  }

  private validateGroupResults(
    group: RecipeConditionGroup,
    results: boolean[],
  ): void {
    const isValid =
      group.operator === 'AND'
        ? results.every((result) => result)
        : results.some((result) => result);

    if (!isValid) {
      throw new NotAcceptableException('통과가 안되는 조건이 있습니다');
    }
  }

  private handleError(
    error: Error,
    recipeGroups: RecipeConditionGroup[],
  ): void {
    if (!(error instanceof NotAcceptableException)) {
      this.logger.error(
        'checkRecipeConditions error',
        error,
        JSON.stringify(recipeGroups),
      );
    }
  }

  async checkRoomRecipeConditions(room: Room): Promise<number[]> {
    const { recipeConditionsTemperature, recipeConditionsHumidity } = room;

    if (
      !recipeConditionsTemperature?.length &&
      !recipeConditionsHumidity?.length
    ) {
      return [];
    }

    this.logger.debug('recipe.condition.check', {
      recipeConditionsTemperature,
      recipeConditionsHumidity,
    });

    const passedRecipeIds = new Set<number>();
    const recipeConditions = [
      ...recipeConditionsTemperature,
      ...recipeConditionsHumidity,
    ];

    for (const condition of recipeConditions) {
      if (!condition.group) continue;

      const isValid = await this.validate(
        condition,
        new ValidationContext(condition, {
          room,
        }),
      );

      if (isValid) {
        passedRecipeIds.add(condition.group.recipeId);
      }
    }
    return Array.from(passedRecipeIds);
  }

  private async validate(
    condition: RecipeCondition,
    context: ValidationContext,
  ): Promise<boolean> {
    const validator = this.conditionValidatorFactory.getValidator(condition);
    return validator.validate(context);
  }
}
