import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RecipeConditionGroup } from '../../recipe-condition/entities/recipe-condition-group.entity';
import { RecipeCommand } from '../../recipe-command/entities/recipe-command.entity';

export enum RecipeStatus {
  STOPPED = 'stopped',
  RUNNING = 'running',
  PENDING = 'pending',
}

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

  @OneToMany(() => RecipeCommand, (recipeCommand) => recipeCommand.recipe, {
    cascade: true,
  })
  recipeCommands: RecipeCommand[];

  @OneToMany(() => RecipeConditionGroup, (group) => group.recipe, {
    cascade: true,
  })
  recipeGroups: RecipeConditionGroup[];

  status: RecipeStatus;
}
