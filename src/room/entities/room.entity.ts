import { Device } from 'src/device/entities/device.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('Rooms')
export class Room {
  @PrimaryColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'integer', nullable: true })
  temperature?: number;

  @Column({ type: 'text', nullable: true })
  sensorId?: string;

  @Column({ type: 'tinyint', nullable: true })
  active?: boolean;

  @Column({ type: 'integer', default: 2750 })
  minTemperature?: number;

  @Column({ type: 'integer', default: 2850 })
  maxTemperature?: number;

  @OneToMany(() => Device, (device) => device.room)
  devices?: Device[];
}
