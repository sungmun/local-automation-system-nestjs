import { IsArrayUniqType } from './is-array-uniq-type.validator';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

class TestType1 {
  constructor(public value: string) {}
}

class TestType2 {
  constructor(public value: string) {}
}

class TestDto {
  @IsArrayUniqType(TestType1)
  array: any[];
}

describe('IsArrayUniqType', () => {
  describe('유효성 검사', () => {
    it('배열에 지정된 타입의 객체가 하나만 있으면 검증을 통과해야 합니다', async () => {
      const dto = plainToInstance(TestDto, {
        array: [new TestType1('test1'), new TestType2('test2')],
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('배열에 지정된 타입의 객체가 두 개 이상 있으면 검증에 실패해야 합니다', async () => {
      const dto = plainToInstance(TestDto, {
        array: [
          new TestType1('test1'),
          new TestType1('test2'),
          new TestType2('test3'),
        ],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('IsArrayUniqType');
    });

    it('배열에 지정된 타입의 객체가 없으면 검증을 통과해야 합니다', async () => {
      const dto = plainToInstance(TestDto, {
        array: [new TestType2('test1'), new TestType2('test2')],
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('에러 메시지', () => {
    it('기본 에러 메시지가 올바르게 표시되어야 합니다', async () => {
      const dto = plainToInstance(TestDto, {
        array: [new TestType1('test1'), new TestType1('test2')],
      });

      const errors = await validate(dto);
      expect(errors[0].constraints.IsArrayUniqType).toBe(
        'TestType1 타입은 배열에 하나만 존재해야 합니다.',
      );
    });
  });
});
