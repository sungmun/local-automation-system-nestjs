import { Injectable, Logger, NotAcceptableException } from '@nestjs/common';
import {
  RecipeCondition,
  RecipeConditionType,
} from './entities/recipe-condition.entity';
import { Room } from '../room/entities/room.entity';
import { RecipeConditionGroup } from './entities/recipe-condition-group.entity';
import { ConditionValidatorFactory } from './validators/condition-validator.factory';
import { ValidationContext } from './validators/validation-context';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeConditionHejHomeDeviceState } from './entities/child-recipe-conditions';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class RecipeConditionService {
  private readonly logger = new Logger(RecipeConditionService.name);

  constructor(
    @InjectRepository(RecipeCondition)
    private readonly recipeConditionRepository: Repository<RecipeCondition>,
    @InjectRepository(RecipeConditionHejHomeDeviceState)
    private readonly recipeConditionHejHomeDeviceStateRepository: Repository<RecipeConditionHejHomeDeviceState>,
    private readonly conditionValidatorFactory: ConditionValidatorFactory,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async validateHejHomeDeviceStateByDeviceId(
    deviceId: string,
  ): Promise<boolean> {
    const condition =
      await this.recipeConditionHejHomeDeviceStateRepository.findOne({
        where: { deviceId },
        relations: { group: true },
      });
    const isValid = await this.validate(
      condition,
      new ValidationContext(condition),
    );
    if (isValid) {
      this.eventEmitter.emit('recipe.condition.check', condition.group);
      return true;
    }
    return false;
  }

  async findRecipeConditionsAndGroupByTypeIn(types: RecipeConditionType[]) {
    return this.recipeConditionRepository.find({
      where: { type: In(types) },
      relations: ['group'],
    });
  }

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
    group: Pick<RecipeConditionGroup, 'conditions'>,
  ): Promise<boolean[]> {
    return Promise.all(
      group.conditions.map(async (condition) => {
        return this.validate(condition, new ValidationContext(condition));
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

  async checkReserveTimeRecipeConditions(
    conditions: RecipeCondition[],
  ): Promise<number[]> {
    const passedRecipeIds = new Set<number>();
    for (const condition of conditions) {
      if (!condition.group) continue;

      const isValid = await this.validate(
        condition,
        new ValidationContext(condition),
      );

      if (isValid) {
        passedRecipeIds.add(condition.group.recipeId);
      }
    }
    return Array.from(passedRecipeIds);
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
    condition: Pick<RecipeCondition, 'type'>,
    context: ValidationContext,
  ): Promise<boolean> {
    const validator = this.conditionValidatorFactory.getValidator(condition);
    return validator.validate(context);
  }
}
