import { BaseValidator } from './base.validator';

class TestValidator extends BaseValidator {
  async validate(): Promise<boolean> {
    return true;
  }

  // compareValues 메서드를 테스트하기 위한 public 메서드
  public testCompareValues(
    value1: number,
    value2: number,
    operator: '<' | '>' | '=' | '>=' | '<=',
  ): boolean {
    return this.compareValues(value1, value2, operator);
  }
}

describe('BaseValidator', () => {
  let validator: TestValidator;

  beforeEach(() => {
    validator = new TestValidator();
  });

  it('검증 가능한 클래스가 정의되어야 한다', () => {
    expect(validator).toBeDefined();
  });

  describe('compareValues', () => {
    describe('작은값 비교 연산자(<)', () => {
      it('첫 번째 값이 두 번째 값보다 작으면 true를 반환해야 합니다', () => {
        expect(validator.testCompareValues(5, 10, '<')).toBe(true);
      });

      it('첫 번째 값이 두 번째 값보다 크거나 같으면 false를 반환해야 합니다', () => {
        expect(validator.testCompareValues(10, 5, '<')).toBe(false);
        expect(validator.testCompareValues(5, 5, '<')).toBe(false);
      });
    });

    describe('큰값 비교 연산자(>)', () => {
      it('첫 번째 값이 두 번째 값보다 크면 true를 반환해야 합니다', () => {
        expect(validator.testCompareValues(10, 5, '>')).toBe(true);
      });

      it('첫 번째 값이 두 번째 값보다 작거나 같으면 false를 반환해야 합니다', () => {
        expect(validator.testCompareValues(5, 10, '>')).toBe(false);
        expect(validator.testCompareValues(5, 5, '>')).toBe(false);
      });
    });

    describe('같음 비교 연산자(=)', () => {
      it('두 값이 같으면 true를 반환해야 합니다', () => {
        expect(validator.testCompareValues(5, 5, '=')).toBe(true);
      });

      it('두 값이 다르면 false를 반환해야 합니다', () => {
        expect(validator.testCompareValues(5, 10, '=')).toBe(false);
      });
    });

    describe('크거나 같음 비교 연산자(>=)', () => {
      it('첫 번째 값이 두 번째 값보다 크거나 같으면 true를 반환해야 합니다', () => {
        expect(validator.testCompareValues(10, 5, '>=')).toBe(true);
        expect(validator.testCompareValues(5, 5, '>=')).toBe(true);
      });

      it('첫 번째 값이 두 번째 값보다 작으면 false를 반환해야 합니다', () => {
        expect(validator.testCompareValues(5, 10, '>=')).toBe(false);
      });
    });

    describe('작거나 같음 비교 연산자(<=)', () => {
      it('첫 번째 값이 두 번째 값보다 작거나 같으면 true를 반환해야 합니다', () => {
        expect(validator.testCompareValues(5, 10, '<=')).toBe(true);
        expect(validator.testCompareValues(5, 5, '<=')).toBe(true);
      });

      it('첫 번째 값이 두 번째 값보다 크면 false를 반환해야 합니다', () => {
        expect(validator.testCompareValues(10, 5, '<=')).toBe(false);
      });
    });
  });
});
