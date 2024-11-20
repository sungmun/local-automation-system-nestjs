import { ValidatorRegistry, RecipeValidator } from './validator.registry';
import { IConditionValidator } from './condition-validator.interface';
import { RecipeCondition } from '../entities/recipe-condition.entity';
import { ValidationContext } from './validation-context';

describe('ValidatorRegistry', () => {
  beforeEach(() => {
    // 각 테스트 전에 validators 배열 초기화
    ValidatorRegistry['validators'] = [];
  });

  describe('register', () => {
    it('validator를 등록해야 합니다', () => {
      @RecipeValidator()
      class TestValidator implements IConditionValidator {
        canHandle(condition: RecipeCondition): boolean {
          return true;
        }
        async validate(context: ValidationContext): Promise<boolean> {
          return true;
        }
      }

      expect(ValidatorRegistry.getValidators()).toContain(TestValidator);
    });

    it('여러 validator를 등록할 수 있어야 합니다', () => {
      @RecipeValidator()
      class TestValidator1 implements IConditionValidator {
        canHandle(condition: RecipeCondition): boolean {
          return true;
        }
        async validate(context: ValidationContext): Promise<boolean> {
          return true;
        }
      }

      @RecipeValidator()
      class TestValidator2 implements IConditionValidator {
        canHandle(condition: RecipeCondition): boolean {
          return true;
        }
        async validate(context: ValidationContext): Promise<boolean> {
          return true;
        }
      }

      const validators = ValidatorRegistry.getValidators();
      expect(validators).toContain(TestValidator1);
      expect(validators).toContain(TestValidator2);
      expect(validators.length).toBe(2);
    });
  });

  describe('getValidators', () => {
    it('등록된 모든 validator를 반환해야 합니다', () => {
      @RecipeValidator()
      class TestValidator1 implements IConditionValidator {
        canHandle(condition: RecipeCondition): boolean {
          return true;
        }
        async validate(context: ValidationContext): Promise<boolean> {
          return true;
        }
      }

      @RecipeValidator()
      class TestValidator2 implements IConditionValidator {
        canHandle(condition: RecipeCondition): boolean {
          return true;
        }
        async validate(context: ValidationContext): Promise<boolean> {
          return true;
        }
      }

      const validators = ValidatorRegistry.getValidators();
      expect(validators).toEqual([TestValidator1, TestValidator2]);
    });

    it('validator가 등록되지 않았을 때 빈 배열을 반환해야 합니다', () => {
      const validators = ValidatorRegistry.getValidators();
      expect(validators).toEqual([]);
    });
  });

  describe('RecipeValidator 데코레이터', () => {
    it('클래스에 데코레이터를 적용하면 ValidatorRegistry에 등록되어야 합니다', () => {
      @RecipeValidator()
      class TestValidator implements IConditionValidator {
        canHandle(condition: RecipeCondition): boolean {
          return true;
        }
        async validate(context: ValidationContext): Promise<boolean> {
          return true;
        }
      }

      const validators = ValidatorRegistry.getValidators();
      expect(validators).toContain(TestValidator);
      expect(validators.length).toBe(1);
    });

    it('여러 클래스에 데코레이터를 적용할 수 있어야 합니다', () => {
      @RecipeValidator()
      class TestValidator1 implements IConditionValidator {
        canHandle(condition: RecipeCondition): boolean {
          return true;
        }
        async validate(context: ValidationContext): Promise<boolean> {
          return true;
        }
      }

      @RecipeValidator()
      class TestValidator2 implements IConditionValidator {
        canHandle(condition: RecipeCondition): boolean {
          return true;
        }
        async validate(context: ValidationContext): Promise<boolean> {
          return true;
        }
      }

      const validators = ValidatorRegistry.getValidators();
      expect(validators).toContain(TestValidator1);
      expect(validators).toContain(TestValidator2);
    });
  });
});
