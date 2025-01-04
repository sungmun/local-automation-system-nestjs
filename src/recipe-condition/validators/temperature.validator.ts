import { Injectable } from '@nestjs/common';
import {
  RecipeCondition,
  RecipeConditionType,
} from '../entities/recipe-condition.entity';
import { IConditionValidator } from './condition-validator.interface';
import { BaseValidator } from './base.validator';
import { RecipeValidator } from './validator.registry';
import { ValidationContext } from './validation-context';
import type { RecipeConditionRoomTemperature } from '../entities/child-recipe-conditions';
import { RoomCrudService } from '../../room/room-crud.service';

@Injectable()
@RecipeValidator()
export class TemperatureValidator
  extends BaseValidator
  implements IConditionValidator
{
  constructor(private readonly roomCrudService: RoomCrudService) {
    super();
  }

  canHandle(condition: Pick<RecipeCondition, 'type'>): boolean {
    return condition.type === RecipeConditionType.ROOM_TEMPERATURE;
  }

  async validate(context: ValidationContext): Promise<boolean> {
    const condition = context.condition as RecipeConditionRoomTemperature;
    const room = await this.roomCrudService.findRoomById(condition.roomId);

    return super.compareValues(
      room.temperature,
      condition.temperature,
      condition.unit,
    );
  }
}
