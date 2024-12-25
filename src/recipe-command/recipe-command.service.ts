import { Injectable, Logger } from '@nestjs/common';
import { RecipeCommand } from './entities/recipe-command.entity';
import { CommandRunnerFactory } from './runners/command-runner.factory';
import { RunnerContext } from './runners/runner-context';
import { RecipeCommandRequestDto } from './dto/request/recipe-command-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class RecipeCommandService {
  private readonly logger = new Logger(RecipeCommandService.name);
  constructor(
    @InjectRepository(RecipeCommand)
    private readonly recipeCommandRepository: Repository<RecipeCommand>,
    private readonly commandRunnerFactory: CommandRunnerFactory,
  ) {}

  public async createRecipeCommands(recipeCommands: RecipeCommandRequestDto[]) {
    return recipeCommands.map((recipeCommand, order) => {
      return this.recipeCommandRepository.create({
        ...instanceToPlain(recipeCommand),
        order,
      });
    });
  }

  public async runCommands(recipeCommands: RecipeCommand[]): Promise<void> {
    for (const recipeCommand of recipeCommands) {
      await this.executeDeviceCommand(
        recipeCommand,
        new RunnerContext(recipeCommand),
      ).then(() => {
        this.logger.log(
          `Recipe command ${recipeCommand.recipeId}/${recipeCommand.name} executed`,
        );
      });
    }
  }

  private async executeDeviceCommand(
    deviceCommand: RecipeCommand,
    context: RunnerContext,
  ): Promise<void> {
    return this.commandRunnerFactory.getRunner(deviceCommand).execute(context);
  }
}
