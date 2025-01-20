import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validate } from 'class-validator';
import { IsRecordType } from './is-record-type.validator';

class TestRecordValue {
  @IsNotEmpty()
  value: string;
}

class TestDto {
  @IsRecordType(TestRecordValue)
  record: Record<string, TestRecordValue>;
}

describe('IsRecordType', () => {
  describe('유효성 검사', () => {
    it('레코드의 모든 값이 유효하면 검증을 통과해야 합니다', async () => {
      const dto = plainToInstance(TestDto, {
        record: {
          key1: { value: 'test1' },
          key2: { value: 'test2' },
        },
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('레코드가 비어있으면 검증에 실패해야 합니다', async () => {
      const dto = plainToInstance(TestDto, {
        record: {},
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('IsRecordType');
    });

    it('레코드의 값이 하나라도 유효하지 않으면 검증에 실패해야 합니다', async () => {
      const dto = plainToInstance(TestDto, {
        record: {
          key1: { value: 'test1' },
          key2: { value: '' }, // 유효하지 않은 값
        },
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('IsRecordType');
    });

    it('레코드가 정의되지 않으면 검증에 실패해야 합니다', async () => {
      const dto = plainToInstance(TestDto, {});

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('IsRecordType');
    });

    it('중첩된 객체의 유효성 검사를 수행해야 합니다', async () => {
      class NestedValue {
        @IsNotEmpty()
        nested: string;
      }

      class TestRecordValueWithNested {
        @IsNotEmpty()
        value: string;

        @IsRecordType(NestedValue)
        nestedRecord: Record<string, NestedValue>;
      }

      const dto = plainToInstance(TestRecordValueWithNested, {
        value: 'test1',
        nestedRecord: {
          nested1: { nested: '' },
        },
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints.IsRecordType).toContain(
        'nested should not be empty',
      );
    });

    it('레코드가 null이면 검증에 실패해야 합니다', async () => {
      const dto = plainToInstance(TestDto, {
        record: null,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints.IsRecordType).toBe('레코드가 비어있습니다');
    });

    it('레코드가 undefined면 검증에 실패해야 합니다', async () => {
      const dto = plainToInstance(TestDto, {
        record: undefined,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints.IsRecordType).toBe('레코드가 비어있습니다');
    });

    it('ClassTransformer가 제공되지 않으면 검증에 실패해야 합니다', async () => {
      class InvalidDto {
        @IsRecordType(undefined)
        record: Record<string, any>;
      }

      const dto = plainToInstance(InvalidDto, {
        record: {
          key1: { value: 'test1' },
        },
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints.IsRecordType).toBe(
        '유효하지 않은 레코드입니다',
      );
    });

    it('ClassTransformer가 null이면 검증에 실패해야 합니다', async () => {
      class InvalidDto {
        @IsRecordType(null)
        record: Record<string, any>;
      }

      const dto = plainToInstance(InvalidDto, {
        record: {
          key1: { value: 'test1' },
        },
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints.IsRecordType).toBe(
        '유효하지 않은 레코드입니다',
      );
    });
  });

  describe('에러 메시지', () => {
    it('레코드가 비어있을 때 적절한 에러 메시지를 반환해야 합니다', async () => {
      const dto = plainToInstance(TestDto, {
        record: {},
      });

      const errors = await validate(dto);
      expect(errors[0].constraints.IsRecordType).toBe('레코드가 비어있습니다');
    });

    it('레코드가 정의되지 않았을 때 적절한 에러 메시지를 반환해야 합니다', async () => {
      const dto = plainToInstance(TestDto, {});

      const errors = await validate(dto);
      expect(errors[0].constraints.IsRecordType).toBe('레코드가 비어있습니다');
    });

    it('중첩된 유효성 검사 오류 메시지를 포함해야 합니다', async () => {
      const dto = plainToInstance(TestDto, {
        record: {
          key1: { value: '' },
          key2: { value: '' },
        },
      });

      const errors = await validate(dto);
      expect(errors[0].constraints.IsRecordType).toContain(
        'value should not be empty',
      );
    });

    it('여러 필드의 유효성 검사 실패 시 모든 에러 메시지를 포함해야 합니다', async () => {
      class TestRecordValueMultiField {
        @IsNotEmpty()
        field1: string;

        @IsNotEmpty()
        field2: string;
      }

      class TestDtoMultiField {
        @IsRecordType(TestRecordValueMultiField)
        record: Record<string, TestRecordValueMultiField>;
      }

      const dto = plainToInstance(TestDtoMultiField, {
        record: {
          key1: { field1: '', field2: '' },
        },
      });

      const errors = await validate(dto);
      expect(errors[0].constraints.IsRecordType).toContain(
        'field1 should not be empty',
      );
      expect(errors[0].constraints.IsRecordType).toContain(
        'field2 should not be empty',
      );
    });

    it('중첩된 유효성 검사 오류 메시지를 반환해야 합니다', async () => {
      class NestedValue {
        @IsNotEmpty()
        nested: string;
      }

      class TestRecordValueWithNested {
        @IsNotEmpty()
        value: string;

        @IsRecordType(NestedValue)
        nestedRecord: Record<string, NestedValue>;
      }

      const dto = plainToInstance(TestRecordValueWithNested, {
        value: 'test1',
        nestedRecord: {
          nested1: { nested: '' },
          nested2: { nested: '' },
        },
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints.IsRecordType).toBe(
        'nested should not be empty, nested should not be empty',
      );
    });

    it('여러 제약 조건의 오류 메시지를 결합해야 합니다', async () => {
      class NestedValue {
        @IsNotEmpty()
        @IsString()
        nested: string;
      }

      class TestRecordValueWithMultipleConstraints {
        @IsRecordType(NestedValue)
        record: Record<string, NestedValue>;
      }

      const dto = plainToInstance(TestRecordValueWithMultipleConstraints, {
        record: {
          key1: { nested: null },
        },
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints.IsRecordType).toContain(
        'nested should not be empty',
      );
      expect(errors[0].constraints.IsRecordType).toContain(
        'nested must be a string',
      );
    });

    it('빈 레코드에 대한 메시지를 반환해야 합니다', async () => {
      class TestDto {
        @IsRecordType(TestRecordValue)
        record: Record<string, TestRecordValue>;
      }

      const dto = plainToInstance(TestDto, {
        record: {},
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints.IsRecordType).toBe('레코드가 비어있습니다');
    });
  });
});
