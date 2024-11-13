import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RecipeCondition } from './recipe-condition.entity';
import { Recipe } from './recipe.entity';

@Entity()
export class RecipeConditionGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  operator: 'AND' | 'OR';

  @OneToMany(() => RecipeCondition, (condition) => condition.group, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  conditions: RecipeCondition[];

  @ManyToOne(() => Recipe, (recipe) => recipe.recipeGroups, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;

  @Column()
  recipeId: number;
}
