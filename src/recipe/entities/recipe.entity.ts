import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DeviceCommand } from './device-command.entity';
import { RecipeConditionGroup } from '../../recipe-condition/entities/recipe-condition-group.entity';

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
    cascade: true,
  })
  deviceCommands: DeviceCommand[];

  @Column({ nullable: true, default: -1 })
  timer: number;

  @OneToMany(() => RecipeConditionGroup, (group) => group.recipe, {
    cascade: true,
  })
  recipeGroups: RecipeConditionGroup[];
}
