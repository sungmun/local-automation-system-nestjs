import { Test, TestingModule } from '@nestjs/testing';
import { LocalTimerRecipeCommandRunner } from './local-timer-recipe-command.runner';
import { TimerManagerService } from '../../timer-manager/timer-manager.service';
import {
  RecipeCommand,
  RecipeCommandPlatform,
} from '../entities/recipe-command.entity';
import { LocalTimerRecipeCommand } from '../entities/child-recipe-command/local-timer-recipe-command.entity';
import { RunnerContext } from './runner-context';

describe('LocalTimerRecipeCommandRunner', () => {
  let runner: LocalTimerRecipeCommandRunner;
  let timerManagerService: jest.Mocked<TimerManagerService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalTimerRecipeCommandRunner,
        {
          provide: TimerManagerService,
          useValue: {
            promiseSetTimer: jest.fn(),
          },
        },
      ],
    }).compile();

    runner = module.get<LocalTimerRecipeCommandRunner>(
      LocalTimerRecipeCommandRunner,
    );
    timerManagerService = module.get(TimerManagerService);
  });

  it('실행기가 정의되어야 한다', () => {
    expect(runner).toBeDefined();
  });

  describe('canHandle', () => {
    it('LOCAL_TIMER 플랫폼의 명령을 처리할 수 있어야 합니다', () => {
      const command = {
        platform: RecipeCommandPlatform.LOCAL_TIMER,
      } as RecipeCommand;

      expect(runner.canHandle(command)).toBe(true);
    });

    it('다른 플랫폼의 명령은 처리할 수 없어야 합니다', () => {
      const command = {
        platform: RecipeCommandPlatform.HEJ_HOME,
      } as RecipeCommand;

      expect(runner.canHandle(command)).toBe(false);
    });
  });

  describe('execute', () => {
    it('타이머를 설정해야 합니다', async () => {
      const command = {
        id: 1,
        platform: RecipeCommandPlatform.LOCAL_TIMER,
        delayTime: 5000,
      } as LocalTimerRecipeCommand;

      const context = new RunnerContext(command);

      await runner.execute(context);

      expect(timerManagerService.promiseSetTimer).toHaveBeenCalledWith(
        'recipe-command-1',
        5000,
      );
    });

    it('타이머 설정 실패 시 에러를 전파해야 합니다', async () => {
      const error = new Error('타이머 설정 실패');
      timerManagerService.promiseSetTimer.mockRejectedValue(error);

      const command = {
        id: 1,
        platform: RecipeCommandPlatform.LOCAL_TIMER,
        delayTime: 5000,
      } as LocalTimerRecipeCommand;

      const context = new RunnerContext(command);

      await expect(runner.execute(context)).rejects.toThrow(error);
    });
  });
});
