import { Test, TestingModule } from '@nestjs/testing';

import { Logger } from '@nestjs/common';
import { RecipeHandler } from './recipe.handler';
import { RecipeService } from './recipe.service';

describe('RecipeHandler', () => {
  let handler: RecipeHandler;
  let recipeService: jest.Mocked<RecipeService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        RecipeHandler,
        {
          provide: RecipeService,
          useValue: {
            recipeCheck: jest.fn(),
            runRecipe: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<RecipeHandler>(RecipeHandler);

    recipeService = module.get(RecipeService);
  });

  it('핸들러가 정의되어야 한다', () => {
    expect(handler).toBeDefined();
  });

  describe('레시피 조건 체크', () => {
    describe('recipeConditionCheck', () => {
      it('조건이 충족되면 레시피를 실행해야 합니다', async () => {
        const data = { recipeId: 1 };
        recipeService.recipeCheck.mockResolvedValue(true);

        await handler.recipeConditionCheck(data);

        expect(recipeService.recipeCheck).toHaveBeenCalledWith(data.recipeId);
        expect(recipeService.runRecipe).toHaveBeenCalledWith(data.recipeId);
      });

      it('조건이 충족되지 않으면 레시피를 실행하지 않아야 합니다', async () => {
        const data = { recipeId: 1 };
        recipeService.recipeCheck.mockResolvedValue(false);

        await handler.recipeConditionCheck(data);

        expect(recipeService.recipeCheck).toHaveBeenCalledWith(data.recipeId);
        expect(recipeService.runRecipe).not.toHaveBeenCalled();
      });

      it('로그가 정상적으로 기록되어야 합니다', async () => {
        const data = { recipeId: 1 };
        const loggerSpy = jest.spyOn(Logger.prototype, 'log');
        recipeService.recipeCheck.mockResolvedValue(true);

        await handler.recipeConditionCheck(data);

        expect(loggerSpy).toHaveBeenCalledWith('recipeConditionCheck', data);
        expect(loggerSpy).toHaveBeenCalledWith(
          'recipeConditionCheck run',
          true,
        );
      });
    });
  });
});
