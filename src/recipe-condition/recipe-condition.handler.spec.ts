import { Test, TestingModule } from '@nestjs/testing';
import { RecipeConditionHandler } from './recipe-condition.handler';
import { RecipeConditionService } from './recipe-condition.service';

describe('RecipeConditionHandler', () => {
  let handler: RecipeConditionHandler;
  let recipeConditionService: jest.Mocked<RecipeConditionService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeConditionHandler,
        {
          provide: RecipeConditionService,
          useValue: {
            validateHejHomeDeviceStateByDeviceId: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<RecipeConditionHandler>(RecipeConditionHandler);
    recipeConditionService = module.get(RecipeConditionService);
  });

  it('핸들러가 정의되어야 한다', () => {
    expect(handler).toBeDefined();
  });

  describe('deviceRecipeConditionCheck', () => {
    it('장치 상태 조건을 검증해야 합니다', async () => {
      const deviceId = 'device-123';

      await handler.deviceRecipeConditionCheck(deviceId);

      expect(
        recipeConditionService.validateHejHomeDeviceStateByDeviceId,
      ).toHaveBeenCalledWith(deviceId);
    });
  });
});
