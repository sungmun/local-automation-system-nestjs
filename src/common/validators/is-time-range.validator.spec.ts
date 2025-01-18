import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { IsDateTimeRange } from './is-time-range.validator';

class TestDto {
  startTime: string;

  @IsDateTimeRange('startTime')
  endTime: string;
}

describe('IsDateTimeRange', () => {
  describe('유효성 검사', () => {
    it('종료 시간이 시작 시간보다 크면 검증을 통과해야 합니다', async () => {
      const dto = plainToInstance(TestDto, {
        startTime: '2024-01-15T10:00:00Z',
        endTime: '2024-01-15T11:00:00Z',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('종료 시간이 시작 시간보다 작으면 검증에 실패해야 합니다', async () => {
      const dto = plainToInstance(TestDto, {
        startTime: '2024-01-15T11:00:00Z',
        endTime: '2024-01-15T10:00:00Z',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints.IsDateTimeRange).toBe(
        '종료 시간은 시작 시간보다 커야합니다',
      );
    });

    it('종료 시간이 시작 시간과 같으면 검증에 실패해야 합니다', async () => {
      const dto = plainToInstance(TestDto, {
        startTime: '2024-01-15T10:00:00Z',
        endTime: '2024-01-15T10:00:00Z',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints.IsDateTimeRange).toBe(
        '종료 시간은 시작 시간보다 커야합니다',
      );
    });

    it('유효하지 않은 날짜 형식이면 검증에 실패해야 합니다', async () => {
      const dto = plainToInstance(TestDto, {
        startTime: 'invalid-date',
        endTime: '2024-01-15T10:00:00Z',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('에러 메시지', () => {
    it('기본 에러 메시지가 올바르게 표시되어야 합니다', async () => {
      const dto = plainToInstance(TestDto, {
        startTime: '2024-01-15T11:00:00Z',
        endTime: '2024-01-15T10:00:00Z',
      });

      const errors = await validate(dto);
      expect(errors[0].constraints.IsDateTimeRange).toBe(
        '종료 시간은 시작 시간보다 커야합니다',
      );
    });
  });
});
