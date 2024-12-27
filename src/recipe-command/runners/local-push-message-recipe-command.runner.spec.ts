import { Test, TestingModule } from '@nestjs/testing';
import { LocalPushMessageRecipeCommandRunner } from './local-push-message-recipe-command.runner';
import { PushMessagingService } from '../../push-messaging/push-messaging.service';
import {
  RecipeCommand,
  RecipeCommandPlatform,
} from '../entities/recipe-command.entity';
import { RunnerContext } from './runner-context';
import { LocalPushMessageRecipeCommand } from '../entities/child-recipe-command';

describe('LocalPushMessageRecipeCommandRunner', () => {
  let runner: LocalPushMessageRecipeCommandRunner;
  let pushMessagingService: jest.Mocked<PushMessagingService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalPushMessageRecipeCommandRunner,
        {
          provide: PushMessagingService,
          useValue: {
            sendMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    runner = module.get<LocalPushMessageRecipeCommandRunner>(
      LocalPushMessageRecipeCommandRunner,
    );
    pushMessagingService = module.get(PushMessagingService);
  });

  it('실행기가 정의되어야 한다', () => {
    expect(runner).toBeDefined();
  });

  describe('canHandle', () => {
    it('LOCAL_PUSH_MESSAGE 플랫폼의 명령을 처리할 수 있어야 합니다', () => {
      const command = {
        platform: RecipeCommandPlatform.LOCAL_PUSH_MESSAGE,
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
    it('푸시 메시지를 전송해야 합니다', async () => {
      const command = {
        platform: RecipeCommandPlatform.LOCAL_PUSH_MESSAGE,
        title: '테스트 제목',
        body: '테스트 내용',
      } as LocalPushMessageRecipeCommand;

      const context = new RunnerContext(command);

      await runner.execute(context);

      expect(pushMessagingService.sendMessage).toHaveBeenCalledWith(
        command.title,
        command.body,
      );
    });

    it('메시지 전송 실패 시 에러를 전파해야 합니다', async () => {
      const error = new Error('메시지 전송 실패');
      pushMessagingService.sendMessage.mockRejectedValue(error);

      const command = {
        platform: RecipeCommandPlatform.LOCAL_PUSH_MESSAGE,
        title: '테스트 제목',
        body: '테스트 내용',
      } as LocalPushMessageRecipeCommand;

      const context = new RunnerContext(command);

      await expect(runner.execute(context)).rejects.toThrow(error);
    });
  });
});
