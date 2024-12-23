import { ReserveTimeConditionResponseDto } from './reserve-time-condition-response.dto';
import { plainToInstance } from 'class-transformer';

describe('ReserveTimeConditionResponseDto', () => {
  it('DTO가 올바르게 변환되어야 합니다', () => {
    const plain = {
      reserveTime: new Date('2024-01-01T15:00:00'),
      type: 'RESERVE_TIME',
    };

    const dto = plainToInstance(ReserveTimeConditionResponseDto, plain);

    expect(dto.reserveTime).toEqual(new Date('2024-01-01T15:00:00'));
    expect(dto.type).toBe('RESERVE_TIME');
  });
});
