import { Recipe } from '../../recipe/entities/recipe.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';

export enum RecipeCommandPlatform {
  HEJ_HOME = 'device-hejhome',
  LOCAL_TIMER = 'local-timer',
  LOCAL_PUSH_MESSAGE = 'local-push-message',
}

@Entity()
@TableInheritance({
  column: { name: 'platform', type: 'text', enum: RecipeCommandPlatform },
})
export class RecipeCommand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', enum: RecipeCommandPlatform, nullable: true })
  platform: RecipeCommandPlatform;

  @Column()
  order: number;

  @Column()
  recipeId: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.recipeCommands, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;
}
