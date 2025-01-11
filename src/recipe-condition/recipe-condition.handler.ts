import { Injectable } from '@nestjs/common';
import { RecipeConditionService } from './recipe-condition.service';
import { OnSafeEvent } from '../common/decorators/safe-event.decoratot';

@Injectable()
export class RecipeConditionHandler {
  constructor(
    private readonly recipeConditionService: RecipeConditionService,
  ) {}

  @OnSafeEvent('finish.**')
  async deviceRecipeConditionCheck(deviceId: string) {
    await this.recipeConditionService.validateHejHomeDeviceStateByDeviceId(
      deviceId,
    );
  }
}
