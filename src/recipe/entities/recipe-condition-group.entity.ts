import {
  Column,
  Entity,
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

  @OneToMany(() => RecipeCondition, (condition) => condition.group)
  conditions: RecipeCondition[];

  @ManyToOne(() => Recipe, (recipe) => recipe.recipeGroups)
  recipe: Recipe;
}
