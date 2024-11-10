import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recipe } from './recipe.entity';
import { Device } from '../../device/entities/device.entity';

@Entity()
export class DeviceCommand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  command: string;

  @Column()
  deviceId: string;

  @Column({ type: 'text', nullable: true })
  platform: string;

  @Column()
  order: number;

  @ManyToOne(() => Device, (device) => device.deviceCommands)
  device: Device;

  @ManyToOne(() => Recipe, (recipe) => recipe.deviceCommands)
  recipe: Recipe;
}
