import { Test, TestingModule } from '@nestjs/testing';
import { RecipeCommandService } from './recipe-command.service';
import { Logger } from '@nestjs/common';
import { RecipeHandler } from './recipe.handler';

describe('RecipeHandler', () => {
  let handler: RecipeHandler;
  let recipeCommandService: jest.Mocked<RecipeCommandService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        RecipeHandler,
        {
          provide: RecipeCommandService,
          useValue: {
            recipeCheck: jest.fn(),
            runRecipe: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<RecipeHandler>(RecipeHandler);

    recipeCommandService = module.get(RecipeCommandService);
  });

  it('핸들러가 정의되어야 한다', () => {
    expect(handler).toBeDefined();
  });

  describe('레시피 조건 체크', () => {
    describe('recipeConditionCheck', () => {
      it('조건이 충족되면 레시피를 실행해야 합니다', async () => {
        const data = { recipeId: 1 };
        recipeCommandService.recipeCheck.mockResolvedValue(true);

        await handler.recipeConditionCheck(data);

        expect(recipeCommandService.recipeCheck).toHaveBeenCalledWith(
          data.recipeId,
        );
        expect(recipeCommandService.runRecipe).toHaveBeenCalledWith(
          data.recipeId,
        );
      });

      it('조건이 충족되지 않으면 레시피를 실행하지 않아야 합니다', async () => {
        const data = { recipeId: 1 };
        recipeCommandService.recipeCheck.mockResolvedValue(false);

        await handler.recipeConditionCheck(data);

        expect(recipeCommandService.recipeCheck).toHaveBeenCalledWith(
          data.recipeId,
        );
        expect(recipeCommandService.runRecipe).not.toHaveBeenCalled();
      });

      it('로그가 정상적으로 기록되어야 합니다', async () => {
        const data = { recipeId: 1 };
        const loggerSpy = jest.spyOn(Logger.prototype, 'log');
        recipeCommandService.recipeCheck.mockResolvedValue(true);

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
