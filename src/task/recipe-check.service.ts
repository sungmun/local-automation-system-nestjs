import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RecipeConditionService } from '../recipe-condition/recipe-condition.service';
import { RecipeConditionType } from '../recipe-condition/entities/recipe-condition.entity';

@Injectable()
export class RecipeCheckService {
  private readonly logger = new Logger(RecipeCheckService.name);

  constructor(
    private readonly recipeConditionService: RecipeConditionService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async checkReserveTimeRecipes() {
    try {
      const recipeConditions =
        await this.recipeConditionService.findRecipeConditionsAndGroupByTypeIn([
          RecipeConditionType.RESERVE_TIME,
        ]);

      const passedRecipeIds =
        await this.recipeConditionService.checkReserveTimeRecipeConditions(
          recipeConditions,
        );

      this.emitRecipeConditionCheck(passedRecipeIds);
    } catch (error) {
      this.logger.error(`예약 시간 레시피 체크 실패: ${error.message}`);
    }
  }

  private emitRecipeConditionCheck(recipeIds: number[]) {
    for (const recipeId of recipeIds) {
      this.logger.debug(`레시피 조건 체크 이벤트 발생: ${recipeId}`);
      this.eventEmitter.emit('recipe.condition.check', { recipeId });
    }
  }
}
