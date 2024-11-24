import { Injectable } from '@nestjs/common';
import {
  RecipeCondition,
  RecipeConditionType,
} from '../entities/recipe-condition.entity';
import { IConditionValidator } from './condition-validator.interface';
import { BaseValidator } from './base.validator';
import { RecipeValidator } from './validator.registry';
import { ValidationContext } from './validation-context';
import { Room } from '../../room/entities/room.entity';
import type { RecipeConditionRoomTemperature } from '../entities/child-recipe-conditions';

@Injectable()
@RecipeValidator()
export class TemperatureValidator
  extends BaseValidator
  implements IConditionValidator
{
  canHandle(condition: RecipeCondition): boolean {
    return condition.type === RecipeConditionType.ROOM_TEMPERATURE;
  }

  async validate(context: ValidationContext): Promise<boolean> {
    const condition = context.condition as RecipeConditionRoomTemperature;
    if (!context.hasValue('room')) {
      throw new Error('Room data is required for temperature validation');
    }
    const room = context.getValue<Room>('room');

    return super.compareValues(
      room.temperature,
      condition.temperature,
      condition.unit,
    );
  }
}
