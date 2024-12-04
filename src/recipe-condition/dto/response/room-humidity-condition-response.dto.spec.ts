import { RoomHumidityConditionResponseDto } from './room-humidity-condition-response.dto';
import { plainToInstance } from 'class-transformer';

describe('RoomHumidityConditionResponseDto', () => {
  it('DTO가 올바르게 변환되어야 합니다', () => {
    const plain = {
      humidity: 60,
      unit: '>',
      roomId: 1,
      type: 'ROOM_HUMIDITY',
    };

    const dto = plainToInstance(RoomHumidityConditionResponseDto, plain);

    expect(dto.humidity).toBe(60);
    expect(dto.unit).toBe('>');
    expect(dto.roomId).toBe(1);
    expect(dto.type).toBe('ROOM_HUMIDITY');
  });
});
