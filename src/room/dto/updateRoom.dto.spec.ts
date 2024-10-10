import { validate } from 'class-validator';
import { UpdateRoomDto } from './updateRoom.dto';

describe('UpdateRoomDto', () => {
  it('유효한 DTO는 오류가 없어야 한다', async () => {
    const dto = new UpdateRoomDto();
    dto.name = '거실';
    dto.acStartTemperature = 22;
    dto.acStopTemperature = 28;
    dto.heatingStartTemperature = 18;
    dto.heatingStopTemperature = 24;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('잘못된 타입의 필드는 오류가 발생해야 한다', async () => {
    const dto = new UpdateRoomDto();
    dto.name = 123 as any; // 잘못된 타입
    dto.acStartTemperature = '스물' as any; // 잘못된 타입

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.map((err) => err.property)).toEqual(
      expect.arrayContaining(['name', 'acStartTemperature']),
    );
  });

  it('온도가 범위를 벗어나면 오류가 발생해야 한다', async () => {
    const dto = new UpdateRoomDto();
    dto.acStartTemperature = 15; // 범위 밖
    dto.acStopTemperature = 35; // 범위 밖
    dto.heatingStartTemperature = 10; // 범위 밖
    dto.heatingStopTemperature = 30; // 범위 밖

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.map((err) => err.property)).toEqual(
      expect.arrayContaining([
        'acStartTemperature',
        'acStopTemperature',
        'heatingStartTemperature',
        'heatingStopTemperature',
      ]),
    );
  });

  it('옵션 필드는 undefined일 수 있다', async () => {
    const dto = new UpdateRoomDto();
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
