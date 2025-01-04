import { Injectable } from '@nestjs/common';
import { RecipeConditionService } from './recipe-condition.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class RecipeConditionHandler {
  constructor(
    private readonly recipeConditionService: RecipeConditionService,
  ) {}

  @OnEvent('finish.**')
  async deviceRecipeConditionCheck(deviceId: string) {
    await this.recipeConditionService.validateHejHomeDeviceStateByDeviceId(
      deviceId,
    );
  }
}
