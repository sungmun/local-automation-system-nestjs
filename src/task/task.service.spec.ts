import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { HejhomeMessageQueueService } from '../hejhome-message-queue/hejhome-message-queue.service';
import { DeviceCheckService } from './device-check.service';
import { RecipeCheckService } from './recipe-check.service';

describe('TaskService', () => {
  let service: TaskService;
  let hejhomeMessageQueueService: jest.Mocked<HejhomeMessageQueueService>;
  let deviceCheckService: jest.Mocked<DeviceCheckService>;
  let recipeCheckService: jest.Mocked<RecipeCheckService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: HejhomeMessageQueueService,
          useValue: { isConnected: jest.fn() },
        },
        {
          provide: DeviceCheckService,
          useValue: { checkDevices: jest.fn() },
        },
        {
          provide: RecipeCheckService,
          useValue: { checkReserveTimeRecipes: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    hejhomeMessageQueueService = module.get(HejhomeMessageQueueService);
    deviceCheckService = module.get(DeviceCheckService);
    recipeCheckService = module.get(RecipeCheckService);
  });

  describe('checkRecipeEvery1Minute', () => {
    it('레시피 체크를 실행해야 한다', async () => {
      await service.checkRecipeEvery1Minute();
      expect(recipeCheckService.checkReserveTimeRecipes).toHaveBeenCalled();
    });

    it('에러가 발생해도 처리되어야 한다', async () => {
      const error = new Error('테스트 에러');
      recipeCheckService.checkReserveTimeRecipes.mockRejectedValue(error);

      await expect(service.checkRecipeEvery1Minute()).resolves.not.toThrow();
    });
  });

  describe('checkDevicesEvery30Seconds', () => {
    it('MQ가 연결되어 있으면 장치 체크를 건너뛰어야 한다', async () => {
      hejhomeMessageQueueService.isConnected.mockReturnValue(true);

      await service.checkDevicesEvery30Seconds();

      expect(deviceCheckService.checkDevices).not.toHaveBeenCalled();
    });

    it('MQ가 연결되어 있지 않으면 장치 체크를 실행해야 한다', async () => {
      hejhomeMessageQueueService.isConnected.mockReturnValue(false);

      await service.checkDevicesEvery30Seconds();

      expect(deviceCheckService.checkDevices).toHaveBeenCalled();
    });

    it('에러가 발생해도 처리되어야 한다', async () => {
      hejhomeMessageQueueService.isConnected.mockReturnValue(false);
      const error = new Error('테스트 에러');
      deviceCheckService.checkDevices.mockRejectedValue(error);

      await expect(service.checkDevicesEvery30Seconds()).resolves.not.toThrow();
    });
  });
});
