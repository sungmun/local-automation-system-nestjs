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
import { Room } from '../../room/entities/room.entity';

export enum RecipeConditionType {
  ROOM_TEMPERATURE = 'ROOM_TEMPERATURE',
  ROOM_HUMIDITY = 'ROOM_HUMIDITY',
}

@Entity()
@TableInheritance({
  column: { name: 'type', type: 'text', enum: RecipeConditionType },
})
export class RecipeCondition {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RecipeConditionGroup, (group) => group.conditions, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'groupId' })
  group: RecipeConditionGroup;

  @Column()
  groupId: number;

  @Column({ type: 'text', enum: RecipeConditionType })
  type: RecipeConditionType;
}

// export abstract class BaseRoomCondition extends RecipeCondition {}

@ChildEntity(RecipeConditionType.ROOM_TEMPERATURE)
export class RecipeConditionRoomTemperature extends RecipeCondition {
  @Column()
  roomId: number;

  @ManyToOne(() => Room, (room) => room.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'roomId' })
  room: Room;
  @Column()
  temperature: number;

  @Column()
  unit: '<' | '>' | '=' | '>=' | '<=';
}

@ChildEntity(RecipeConditionType.ROOM_HUMIDITY)
export class RecipeConditionRoomHumidity extends RecipeCondition {
  @Column()
  roomId: number;

  @ManyToOne(() => Room, (room) => room.id, {
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
