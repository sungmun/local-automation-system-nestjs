import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DeviceCommand } from './device-command.entity';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  active: boolean;

  @Column()
  type: string;

  @OneToMany(() => DeviceCommand, (deviceCommand) => deviceCommand.recipe, {
    cascade: ['insert', 'update', 'remove'],
  })
  deviceCommands: DeviceCommand[];
}
