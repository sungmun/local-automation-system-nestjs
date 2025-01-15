import { Test, TestingModule } from '@nestjs/testing';
import { HejHomeRecipeCommandRunner } from './hej-home-recipe-command.runner';
import { HejhomeApiService } from '../../hejhome-api/hejhome-api.service';
import {
  RecipeCommand,
  RecipeCommandPlatform,
} from '../entities/recipe-command.entity';
import { RunnerContext } from './runner-context';
import { HejHomeRecipeCommand } from '../entities/child-recipe-command/hej-home-recipe-command.entity';

describe('HejHomeRecipeCommandRunner', () => {
  let runner: HejHomeRecipeCommandRunner;
  let hejhomeApiService: jest.Mocked<HejhomeApiService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HejHomeRecipeCommandRunner,
        {
          provide: HejhomeApiService,
          useValue: {
            setDeviceControl: jest.fn(),
          },
        },
      ],
    }).compile();

    runner = module.get<HejHomeRecipeCommandRunner>(HejHomeRecipeCommandRunner);
    hejhomeApiService = module.get(HejhomeApiService);
  });

  it('실행기가 정의되어야 한다', () => {
    expect(runner).toBeDefined();
  });

  describe('canHandle', () => {
    it('HEJ_HOME 플랫폼의 명령을 처리할 수 있어야 합니다', () => {
      const command = {
        platform: RecipeCommandPlatform.HEJ_HOME,
      } as RecipeCommand;

      expect(runner.canHandle(command)).toBe(true);
    });
  });

  describe('execute', () => {
    it('HEJ_HOME API를 통해 명령을 실행해야 합니다', async () => {
      const command = {
        platform: RecipeCommandPlatform.HEJ_HOME,
        deviceId: 'device-1',
        command: { power: 'on' },
      } as HejHomeRecipeCommand;

      const context = new RunnerContext(command);

      await runner.execute(context);

      expect(hejhomeApiService.setDeviceControl).toHaveBeenCalledWith(
        'device-1',
        {
          requirments: { power: 'on' },
        },
      );
    });

    it('API 호출 실패 시 에러를 전파해야 합니다', async () => {
      const error = new Error('API 호출 실패');
      hejhomeApiService.setDeviceControl.mockRejectedValue(error);

      const command = {
        platform: RecipeCommandPlatform.HEJ_HOME,
        deviceId: 'device-1',
        command: { power: 'on' },
      } as HejHomeRecipeCommand;

      const context = new RunnerContext(command);

      await expect(runner.execute(context)).rejects.toThrow(error);
    });
  });
});
