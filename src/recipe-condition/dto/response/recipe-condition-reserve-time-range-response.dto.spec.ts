import { RecipeConditionReserveTimeRangeResponseDto } from './recipe-condition-reserve-time-range-response.dto';
import { plainToInstance } from 'class-transformer';

describe('RecipeConditionReserveTimeRangeResponseDto', () => {
  it('DTO가 올바르게 변환되어야 합니다', () => {
    const plain = {
      reserveStartTime: new Date('2024-01-01T09:00:00'),
      reserveEndTime: new Date('2024-01-01T18:00:00'),
      type: 'RESERVE_TIME_RANGE',
    };

    const dto = plainToInstance(
      RecipeConditionReserveTimeRangeResponseDto,
      plain,
    );

    expect(dto.reserveStartTime).toEqual(new Date('2024-01-01T09:00:00'));
    expect(dto.reserveEndTime).toEqual(new Date('2024-01-01T18:00:00'));
    expect(dto.type).toBe('RESERVE_TIME_RANGE');
  });
});
