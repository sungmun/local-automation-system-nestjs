import { Test, TestingModule } from '@nestjs/testing';
import { RecipeCheckService } from './recipe-check.service';
import { RecipeConditionService } from '../recipe-condition/recipe-condition.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  RecipeCondition,
  RecipeConditionType,
} from '../recipe-condition/entities/recipe-condition.entity';
import { Logger } from '@nestjs/common';

describe('RecipeCheckService', () => {
  let service: RecipeCheckService;
  let recipeConditionService: jest.Mocked<RecipeConditionService>;
  let eventEmitter: jest.Mocked<EventEmitter2>;
  let loggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeCheckService,
        {
          provide: RecipeConditionService,
          useValue: {
            findRecipeConditionsAndGroupByTypeIn: jest.fn(),
            checkReserveTimeRecipeConditions: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RecipeCheckService>(RecipeCheckService);
    recipeConditionService = module.get(RecipeConditionService);
    eventEmitter = module.get(EventEmitter2);
    loggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
  });

  describe('checkReserveTimeRecipes', () => {
    it('예약 시간 레시피 조건을 확인하고 이벤트를 발생시켜야 합니다', async () => {
      const mockRecipeConditions = [
        {
          type: RecipeConditionType.RESERVE_TIME,
          id: 1,
          group: { id: 1, recipeId: 1 },
          groupId: 1,
        },
      ] as RecipeCondition[];
      const mockPassedRecipeIds = [1, 2, 3];

      recipeConditionService.findRecipeConditionsAndGroupByTypeIn.mockResolvedValue(
        mockRecipeConditions,
      );
      recipeConditionService.checkReserveTimeRecipeConditions.mockResolvedValue(
        mockPassedRecipeIds,
      );

      await service.checkReserveTimeRecipes();

      expect(
        recipeConditionService.findRecipeConditionsAndGroupByTypeIn,
      ).toHaveBeenCalledWith([
        RecipeConditionType.RESERVE_TIME,
        RecipeConditionType.RESERVE_TIME_RANGE,
        RecipeConditionType.WEEKLY_RECURRING_SCHEDULE,
        RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE,
      ]);
      expect(
        recipeConditionService.checkReserveTimeRecipeConditions,
      ).toHaveBeenCalledWith(mockRecipeConditions);

      mockPassedRecipeIds.forEach((recipeId) => {
        expect(eventEmitter.emit).toHaveBeenCalledWith(
          'recipe.condition.check',
          { recipeId },
        );
      });
    });

    it('레시피 조건 조회 중 에러가 발생하면 로그를 기록해야 합니다', async () => {
      const error = new Error('테스트 에러');
      recipeConditionService.findRecipeConditionsAndGroupByTypeIn.mockRejectedValue(
        error,
      );

      await service.checkReserveTimeRecipes();

      expect(loggerSpy).toHaveBeenCalledWith(
        `예약 시간 레시피 체크 실패: ${error.message}`,
      );
      expect(eventEmitter.emit).not.toHaveBeenCalled();
    });

    it('레시피 조건 체크 중 에러가 발생하면 로그를 기록해야 합니다', async () => {
      const mockRecipeConditions = [
        {
          type: RecipeConditionType.RESERVE_TIME,
          id: 1,
          group: { id: 1, recipeId: 1 },
          groupId: 1,
        },
      ] as RecipeCondition[];

      const error = new Error('테스트 에러');

      recipeConditionService.findRecipeConditionsAndGroupByTypeIn.mockResolvedValue(
        mockRecipeConditions,
      );
      recipeConditionService.checkReserveTimeRecipeConditions.mockRejectedValue(
        error,
      );

      await service.checkReserveTimeRecipes();

      expect(loggerSpy).toHaveBeenCalledWith(
        `예약 시간 레시피 체크 실패: ${error.message}`,
      );
      expect(eventEmitter.emit).not.toHaveBeenCalled();
    });

    it('조건을 만족하는 레시피가 없으면 이벤트를 발생시키지 않아야 합니다', async () => {
      const mockRecipeConditions = [
        { type: RecipeConditionType.RESERVE_TIME, id: 1 },
      ] as RecipeCondition[];

      recipeConditionService.findRecipeConditionsAndGroupByTypeIn.mockResolvedValue(
        mockRecipeConditions,
      );
      recipeConditionService.checkReserveTimeRecipeConditions.mockResolvedValue(
        [],
      );

      await service.checkReserveTimeRecipes();

      expect(eventEmitter.emit).not.toHaveBeenCalled();
    });
  });
});
