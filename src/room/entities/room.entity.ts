import {
  RecipeConditionRoomHumidity,
  RecipeConditionRoomTemperature,
} from 'src/recipe/entities/recipe-condition.entity';
import { Device } from '../../device/entities/device.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('Rooms')
export class Room {
  @PrimaryColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'integer', nullable: true })
  temperature?: number;

  @Column({ type: 'integer', nullable: true })
  humidity?: number;

  @Column({ type: 'text', nullable: true })
  sensorId?: string;

  @Column({ type: 'tinyint', nullable: true })
  active?: boolean;

  @Column({ type: 'integer', nullable: true, default: 2750 })
  acStartTemperature?: number;

  @Column({ type: 'integer', nullable: true, default: 2850 })
  acStopTemperature?: number;

  @Column({ type: 'integer', nullable: true, default: 1800 })
  heatingStartTemperature?: number;

  @Column({ type: 'integer', nullable: true, default: 2000 })
  heatingStopTemperature?: number;

  @OneToMany(() => Device, (device) => device.room)
  devices?: Device[];

  @OneToMany(
    () => RecipeConditionRoomTemperature || RecipeConditionRoomHumidity,
    (condition) => condition.room,
  )
  conditions?: RecipeConditionRoomTemperature | RecipeConditionRoomHumidity[];
}
