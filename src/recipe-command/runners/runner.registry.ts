import { Injectable, Type } from '@nestjs/common';
import { ICommandRunner } from './command-runner.interface';

@Injectable()
export class RunnerRegistry {
  private static runners: Type<ICommandRunner>[] = [];

  static register(runner: Type<ICommandRunner>) {
    RunnerRegistry.runners.push(runner);
  }

  static getRunners(): Type<ICommandRunner>[] {
    return RunnerRegistry.runners;
  }
}

export function RecipeRunner() {
  return function (target: Type<ICommandRunner>) {
    RunnerRegistry.register(target);
  };
}
