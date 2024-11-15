import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RecipeCondition } from './recipe-condition.entity';
import { Recipe } from '../../recipe/entities/recipe.entity';

@Entity()
export class RecipeConditionGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  operator: 'AND' | 'OR';

  @OneToMany(() => RecipeCondition, (condition) => condition.group, {
    cascade: true,
  })
  conditions: RecipeCondition[];

  @ManyToOne(() => Recipe, (recipe) => recipe.recipeGroups, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;

  @Column()
  recipeId: number;
}
