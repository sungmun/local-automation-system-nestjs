import { Module } from '@nestjs/common';
import { RecipeCommandService } from './recipe-command.service';

import { RunnerRegistry } from './runners/runner.registry';
import { CommandRunnerFactory } from './runners/command-runner.factory';
import { ICommandRunner } from './runners/command-runner.interface';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeCommand } from './entities/recipe-command.entity';
import { DeviceModule } from '../device/device.module';
import { HejhomeApiModule } from '../hejhome-api/hejhome-api.module';
import * as RecipeCommandChild from './entities/child-recipe-command';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RecipeCommand,
      ...Object.values(RecipeCommandChild),
    ]),
    DeviceModule,
    HejhomeApiModule,
  ],
  providers: [
    RecipeCommandService,
    RunnerRegistry,
    {
      provide: 'COMMAND_RUNNERS',
      useFactory: () => {
        const runnerTypes = RunnerRegistry.getRunners();
        return runnerTypes.map((runnerType) => new runnerType());
      },
    },
    {
      provide: CommandRunnerFactory,
      useFactory: (runners: ICommandRunner[]) =>
        new CommandRunnerFactory(runners),
      inject: ['COMMAND_RUNNERS'],
    },
  ],
  exports: [RecipeCommandService],
})
export class RecipeCommandModule {}
