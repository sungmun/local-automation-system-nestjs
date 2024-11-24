import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import type { RecipeConditionGroup } from './recipe-condition-group.entity';

export enum RecipeConditionType {
  ROOM_TEMPERATURE = 'ROOM_TEMPERATURE',
  ROOM_HUMIDITY = 'ROOM_HUMIDITY',
  RESERVE_TIME = 'RESERVE_TIME',
  RESERVE_TIME_RANGE = 'RESERVE_TIME_RANGE',
}

@Entity()
@TableInheritance({
  column: { name: 'type', type: 'text', enum: RecipeConditionType },
})
export class RecipeCondition {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    'RecipeConditionGroup',
    (group: RecipeConditionGroup) => group.conditions,
    {
      orphanedRowAction: 'delete',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'groupId' })
  group: RecipeConditionGroup;

  @Column()
  groupId: number;

  @Column({ type: 'text', enum: RecipeConditionType })
  type: RecipeConditionType;
}
