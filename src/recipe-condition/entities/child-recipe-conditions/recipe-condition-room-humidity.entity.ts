import { ChildEntity, Column, JoinColumn, ManyToOne } from 'typeorm';
import {
  RecipeCondition,
  RecipeConditionType,
} from '../recipe-condition.entity';
import { Room } from '../../../room/entities/room.entity';

@ChildEntity(RecipeConditionType.ROOM_HUMIDITY)
export class RecipeConditionRoomHumidity extends RecipeCondition {
  @Column()
  roomId: number;

  @ManyToOne(() => Room, (room) => room.recipeConditionsHumidity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @Column()
  humidity: number;

  @Column()
  unit: '<' | '>' | '=' | '>=' | '<=';
}
