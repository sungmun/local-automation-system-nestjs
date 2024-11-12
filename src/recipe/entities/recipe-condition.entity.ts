import {
  ChildEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { RecipeConditionGroup } from './recipe-condition-group.entity';
import { Room } from 'src/room/entities/room.entity';

export enum RecipeConditionType {
  ROOM_TEMPERATURE = 'ROOM_TEMPERATURE',
  ROOM_HUMIDITY = 'ROOM_HUMIDITY',
}

@Entity()
@TableInheritance({
  column: { type: 'enum', name: 'type', enum: RecipeConditionType },
})
export class RecipeCondition {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RecipeConditionGroup, (group) => group.conditions)
  group: RecipeConditionGroup;

  @Column({ enum: RecipeConditionType })
  type: RecipeConditionType;
}

@ChildEntity(RecipeConditionType.ROOM_TEMPERATURE)
export class RecipeConditionRoomTemperature extends RecipeCondition {
  @Column()
  temperature: number;

  @Column()
  unit: '<' | '>' | '=' | '>=' | '<=';

  @Column()
  roomId: number;

  @ManyToOne(() => Room, (room) => room.id)
  @JoinColumn({ name: 'roomId' })
  room: Room;
}

@ChildEntity(RecipeConditionType.ROOM_HUMIDITY)
export class RecipeConditionRoomHumidity extends RecipeCondition {
  @Column()
  humidity: number;

  @Column()
  unit: '<' | '>' | '=' | '>=' | '<=';

  @Column()
  roomId: number;

  @ManyToOne(() => Room, (room) => room.id)
  @JoinColumn({ name: 'roomId' })
  room: Room;
}
