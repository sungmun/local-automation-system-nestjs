import { Injectable } from '@nestjs/common';
import {
  RecipeCondition,
  RecipeConditionType,
} from '../entities/recipe-condition.entity';
import { IConditionValidator } from './condition-validator.interface';
import { BaseValidator } from './base.validator';
import { RecipeValidator } from './validator.registry';
import { ValidationContext } from './validation-context';
import { RecipeConditionStatusDelayMaintain } from '../entities/child-recipe-conditions';
import { RecipeStatus } from '../../recipe/entities/recipe.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
@RecipeValidator()
export class StatusDelayMaintainValidator
  extends BaseValidator
  implements IConditionValidator
{
  constructor(
    @InjectRepository(RecipeConditionStatusDelayMaintain)
    private readonly recipeConditionRepository: Repository<RecipeConditionStatusDelayMaintain>,
  ) {
    super();
  }

  canHandle(condition: RecipeCondition): boolean {
    return condition.type === RecipeConditionType.STATUS_DELAY_MAINTAIN;
  }

  async validate(context: ValidationContext): Promise<boolean> {
    const condition = context.condition as RecipeConditionStatusDelayMaintain;

    if (condition.status === RecipeStatus.STOPPED) {
      return this.startDelayTimer(condition);
    }

    return this.checkDelayTime(condition);
  }

  private async startDelayTimer(
    condition: RecipeConditionStatusDelayMaintain,
  ): Promise<boolean> {
    await this.recipeConditionRepository.update(condition.id, {
      status: RecipeStatus.RUNNING,
      startDelayTime: new Date(),
    });
    return false;
  }

  private async checkDelayTime(
    condition: RecipeConditionStatusDelayMaintain,
  ): Promise<boolean> {
    const startDelayTime = new Date(condition.startDelayTime);
    const delayTime = condition.delayTime;
    const currentTime = new Date();

    if (startDelayTime.getTime() + delayTime * 1000 > currentTime.getTime()) {
      return false;
    }

    await this.recipeConditionRepository.update(condition.id, {
      status: RecipeStatus.STOPPED,
      startDelayTime: null,
    });
    return true;
  }
}
