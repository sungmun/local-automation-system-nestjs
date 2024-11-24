import { Injectable } from '@nestjs/common';
import {
  RecipeCondition,
  RecipeConditionType,
} from '../entities/recipe-condition.entity';
import { IConditionValidator } from './condition-validator.interface';
import { Room } from '../../room/entities/room.entity';
import { BaseValidator } from './base.validator';
import { RecipeValidator } from './validator.registry';
import { ValidationContext } from './validation-context';
import { RecipeConditionRoomHumidity } from '../entities/child-recipe-conditions';

@Injectable()
@RecipeValidator()
export class HumidityValidator
  extends BaseValidator
  implements IConditionValidator
{
  canHandle(condition: RecipeCondition): boolean {
    return condition.type === RecipeConditionType.ROOM_HUMIDITY;
  }

  async validate(context: ValidationContext): Promise<boolean> {
    const condition = context.condition as RecipeConditionRoomHumidity;
    if (!context.hasValue('room')) {
      throw new Error('Room data is required for humidity validation');
    }
    const room = context.getValue<Room>('room');

    return super.compareValues(
      room.humidity,
      condition.humidity,
      condition.unit,
    );
  }
}
