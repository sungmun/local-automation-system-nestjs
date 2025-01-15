import { Injectable, Logger } from '@nestjs/common';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { RecipeConditionService } from '../recipe-condition/recipe-condition.service';

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly recipeConditionService: RecipeConditionService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async initRooms(rooms: Room[]) {
    this.roomRepository
      .createQueryBuilder()
      .insert()
      .values(rooms)
      .orIgnore()
      .execute();
  }

  async activeRoomRecipe(sensorId: string) {
    const room = await this.roomRepository.findOne({
      where: { sensorId },
      relations: [
        'recipeConditionsTemperature',
        'recipeConditionsHumidity',
        'recipeConditionsTemperature.group',
        'recipeConditionsHumidity.group',
      ],
    });

    if (!room) return;

    const passedRecipeIds =
      await this.recipeConditionService.checkRoomRecipeConditions(room);

    passedRecipeIds.forEach((recipeId) => {
      this.eventEmitter.emit('recipe.condition.check', { recipeId });
    });
  }
}
