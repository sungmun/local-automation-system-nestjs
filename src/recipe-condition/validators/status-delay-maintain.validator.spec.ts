import { Test, TestingModule } from '@nestjs/testing';
import { StatusDelayMaintainValidator } from './status-delay-maintain.validator';
import {
  RecipeCondition,
  RecipeConditionType,
} from '../entities/recipe-condition.entity';
import { ValidationContext } from './validation-context';
import { RecipeStatus } from '../../recipe/entities/recipe.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RecipeConditionStatusDelayMaintain } from '../entities/child-recipe-conditions';

describe('StatusDelayMaintainValidator', () => {
  let validator: StatusDelayMaintainValidator;
  let repository: jest.Mocked<Repository<RecipeConditionStatusDelayMaintain>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatusDelayMaintainValidator,
        {
          provide: getRepositoryToken(RecipeConditionStatusDelayMaintain),
          useValue: {
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    validator = module.get<StatusDelayMaintainValidator>(
      StatusDelayMaintainValidator,
    );
    repository = module.get(
      getRepositoryToken(RecipeConditionStatusDelayMaintain),
    );
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('검증 가능한 클래스가 정의되어야 한다', () => {
    expect(validator).toBeDefined();
  });

  describe('canHandle', () => {
    it('STATUS_DELAY_MAINTAIN 타입의 조건을 처리할 수 있어야 합니다', () => {
      const condition = {
        type: RecipeConditionType.STATUS_DELAY_MAINTAIN,
      } as RecipeCondition;

      expect(validator.canHandle(condition)).toBe(true);
    });

    it('STATUS_DELAY_MAINTAIN 타입이 아닌 조건은 처리할 수 없어야 합니다', () => {
      const condition = {
        type: RecipeConditionType.RESERVE_TIME,
      } as RecipeCondition;

      expect(validator.canHandle(condition)).toBe(false);
    });
  });

  describe('validate', () => {
    it('상태가 STOPPED일 때 타이머를 시작하고 false를 반환해야 합니다', async () => {
      const now = new Date('2024-01-15T10:00:00.000Z');
      jest.setSystemTime(now);

      const condition = {
        id: 1,
        type: RecipeConditionType.STATUS_DELAY_MAINTAIN,
        status: RecipeStatus.STOPPED,
      } as RecipeConditionStatusDelayMaintain;

      const context = new ValidationContext(condition);
      const result = await validator.validate(context);

      expect(repository.update).toHaveBeenCalledWith(1, {
        status: RecipeStatus.RUNNING,
        startDelayTime: now,
      });
      expect(result).toBe(false);
    });

    it('딜레이 시간이 경과하지 않았으면 false를 반환해야 합니다', async () => {
      const startTime = new Date('2024-01-15T10:00:00.000Z');
      const now = new Date('2024-01-15T10:00:30.000Z'); // 30초 경과
      jest.setSystemTime(now);

      const condition = {
        id: 1,
        type: RecipeConditionType.STATUS_DELAY_MAINTAIN,
        status: RecipeStatus.RUNNING,
        startDelayTime: startTime,
        delayTime: 60, // 60초 딜레이
      } as RecipeConditionStatusDelayMaintain;

      const context = new ValidationContext(condition);
      const result = await validator.validate(context);

      expect(result).toBe(false);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('딜레이 시간이 경과하면 상태를 초기화하고 true를 반환해야 합니다', async () => {
      const startTime = new Date('2024-01-15T10:00:00.000Z');
      const now = new Date('2024-01-15T10:01:00.000Z'); // 60초 경과
      jest.setSystemTime(now);

      const condition = {
        id: 1,
        type: RecipeConditionType.STATUS_DELAY_MAINTAIN,
        status: RecipeStatus.RUNNING,
        startDelayTime: startTime,
        delayTime: 60, // 60초 딜레이
      } as RecipeConditionStatusDelayMaintain;

      const context = new ValidationContext(condition);
      const result = await validator.validate(context);

      expect(repository.update).toHaveBeenCalledWith(1, {
        status: RecipeStatus.STOPPED,
        startDelayTime: null,
      });
      expect(result).toBe(true);
    });
  });
});
