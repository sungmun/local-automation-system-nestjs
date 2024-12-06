import { ValidationContext } from './validation-context';
import { RecipeCondition } from '../entities/recipe-condition.entity';

describe('ValidationContext', () => {
  let condition: RecipeCondition;
  let additionalData: Record<string, any>;
  let context: ValidationContext;

  beforeEach(() => {
    condition = {
      id: 1,
      type: 'ROOM_TEMPERATURE',
      temperature: 25,
      unit: '>',
    } as unknown as RecipeCondition;

    additionalData = {
      temperature: 26,
      humidity: 60,
    };

    context = new ValidationContext(condition, additionalData);
  });

  it('검증 가능한 클래스가 정의되어야 한다', () => {
    expect(context).toBeDefined();
  });

  describe('생성자', () => {
    it('condition과 additionalData를 정상적으로 초기화해야 합니다', () => {
      expect(context.condition).toBe(condition);
    });

    it('additionalData가 없을 경우 빈 객체로 초기화되어야 합니다', () => {
      const contextWithoutData = new ValidationContext(condition);
      expect(contextWithoutData.hasValue('anyKey')).toBe(false);
    });
  });

  describe('getValue', () => {
    it('존재하는 키에 대한 값을 반환해야 합니다', () => {
      expect(context.getValue<number>('temperature')).toBe(26);
      expect(context.getValue<number>('humidity')).toBe(60);
    });

    it('존재하지 않는 키에 대해 undefined를 반환해야 합니다', () => {
      expect(context.getValue<number>('nonexistent')).toBeUndefined();
    });
  });

  describe('hasValue', () => {
    it('존재하는 키에 대해 true를 반환해야 합니다', () => {
      expect(context.hasValue('temperature')).toBe(true);
      expect(context.hasValue('humidity')).toBe(true);
    });

    it('존재하지 않는 키에 대해 false를 반환해야 합니다', () => {
      expect(context.hasValue('nonexistent')).toBe(false);
    });

    it('값이 null이나 undefined인 경우에도 키가 존재하면 true를 반환해야 합니다', () => {
      const contextWithNullValues = new ValidationContext(condition, {
        nullValue: null,
        undefinedValue: undefined,
      });

      expect(contextWithNullValues.hasValue('nullValue')).toBe(true);
      expect(contextWithNullValues.hasValue('undefinedValue')).toBe(true);
    });
  });
});
