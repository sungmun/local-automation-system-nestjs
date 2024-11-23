import { plainToInstance } from 'class-transformer';
import { TransformDate } from './transform-date.decorator';

class TestDto {
  @TransformDate()
  date: Date;
}

describe('TransformDate', () => {
  it('날짜 문자열을 Date 객체로 변환하고 초와 밀리초를 0으로 설정해야 합니다', () => {
    const dateString = '2024-01-15T10:30:45.123Z';
    const dto = plainToInstance(TestDto, { date: dateString });

    expect(dto.date).toBeInstanceOf(Date);
    expect(dto.date.getSeconds()).toBe(0);
    expect(dto.date.getMilliseconds()).toBe(0);
    expect(dto.date.toISOString()).toBe('2024-01-15T10:30:00.000Z');
  });

  it('이미 Date 객체인 경우에도 초와 밀리초를 0으로 설정해야 합니다', () => {
    const date = new Date('2024-01-15T10:30:45.123Z');
    const dto = plainToInstance(TestDto, { date });

    expect(dto.date).toBeInstanceOf(Date);
    expect(dto.date.getSeconds()).toBe(0);
    expect(dto.date.getMilliseconds()).toBe(0);
    expect(dto.date.toISOString()).toBe('2024-01-15T10:30:00.000Z');
  });

  it('유효하지 않은 날짜 문자열이 주어지면 Invalid Date를 ���환해야 합니다', () => {
    const dto = plainToInstance(TestDto, { date: 'invalid-date' });
    expect(dto.date.toString()).toBe('Invalid Date');
  });
});
