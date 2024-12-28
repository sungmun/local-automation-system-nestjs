import { ChildEntity } from 'typeorm';
import { RecipeCommand, RecipeCommandPlatform } from '../recipe-command.entity';

@ChildEntity(RecipeCommandPlatform.LOCAL_PUSH_MESSAGE)
export class LocalPushMessageRecipeCommand extends RecipeCommand {
  title: string;
  body: string;
}
