import { Injectable } from '@nestjs/common';
import {
  RecipeCondition,
  RecipeConditionType,
} from '../entities/recipe-condition.entity';
import { IConditionValidator } from './condition-validator.interface';
import { BaseValidator } from './base.validator';
import { RecipeValidator } from './validator.registry';
import { ValidationContext } from './validation-context';
import type { RecipeConditionHejHomeDeviceState } from '../entities/child-recipe-conditions';
import { DataBaseDeviceService } from '../../device/database-device.service';

@Injectable()
@RecipeValidator()
export class HejHomeDeviceStateValidator
  extends BaseValidator
  implements IConditionValidator
{
  constructor(private readonly deviceService: DataBaseDeviceService) {
    super();
  }

  canHandle(condition: Pick<RecipeCondition, 'type'>): boolean {
    return condition.type === RecipeConditionType.HEJ_HOME_DEVICE_STATE;
  }

  async validate(context: ValidationContext): Promise<boolean> {
    const condition = context.condition as RecipeConditionHejHomeDeviceState;
    const device = await this.deviceService.findOne(condition.deviceId);
    return Object.entries(condition.deviceState).every(([key, checkState]) => {
      if (Object.prototype.hasOwnProperty.call(device.state, key) === false) {
        return false;
      }

      const deviceState = device.state[key];

      if (typeof checkState.value === 'string') {
        return deviceState === checkState.value;
      }

      return this.compareValues(deviceState, checkState.value, checkState.unit);
    });
  }
}
