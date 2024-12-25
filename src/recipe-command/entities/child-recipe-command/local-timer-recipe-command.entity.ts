import { ChildEntity, Column } from 'typeorm';
import { RecipeCommand, RecipeCommandPlatform } from '../recipe-command.entity';

@ChildEntity(RecipeCommandPlatform.LOCAL_TIMER)
export class LocalTimerRecipeCommand extends RecipeCommand {
  @Column()
  delayTime: number;
}
