import { Test, TestingModule } from '@nestjs/testing';
import { CommandRunnerFactory } from './command-runner.factory';
import { ICommandRunner } from './command-runner.interface';
import {
  RecipeCommand,
  RecipeCommandPlatform,
} from '../entities/recipe-command.entity';

describe('CommandRunnerFactory', () => {
  let factory: CommandRunnerFactory;
  let mockHejHomeRunner: ICommandRunner;

  beforeEach(async () => {
    mockHejHomeRunner = {
      canHandle: jest.fn(
        (command) => command.platform === RecipeCommandPlatform.HEJ_HOME,
      ),
      execute: jest.fn(),
    } as ICommandRunner;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommandRunnerFactory,
        {
          provide: 'COMMAND_RUNNERS',
          useValue: [mockHejHomeRunner],
        },
      ],
    }).compile();

    factory = module.get<CommandRunnerFactory>(CommandRunnerFactory);
  });

  describe('getRunner', () => {
    it('HEJ_HOME 플랫폼에 대한 올바른 runner를 반환해야 합니다', () => {
      const command = {
        platform: RecipeCommandPlatform.HEJ_HOME,
      } as RecipeCommand;

      const runner = factory.getRunner(command);

      expect(mockHejHomeRunner.canHandle).toHaveBeenCalledWith(command);
      expect(runner).toBe(mockHejHomeRunner);
    });

    it('지원하지 않는 플랫폼에 대해 예외를 발생시켜야 합니다', () => {
      const command = {
        platform: 'UNSUPPORTED_PLATFORM',
      } as unknown as RecipeCommand;

      expect(() => factory.getRunner(command)).toThrow(
        'No runner found for recipeCommand platform: UNSUPPORTED_PLATFORM',
      );
    });
  });
});
