import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ListLogResponseDto, LogResponseDto } from './list-log-response.dto';

describe('ListLogResponseDto', () => {
  it('유효한 데이터가 주어지면 검증을 통과해야 합니다', async () => {
    const data = {
      list: [
        {
          id: 1,
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
          logMessage:
            'DEVICE_AUTO_CHANGE - <[IrAirconditioner](device123) / {"power":"켜짐"}>',
        },
        {
          id: 2,
          createdAt: new Date('2024-01-02T00:00:00.000Z'),
          logMessage:
            'DEVICE_AUTO_CHANGE - <[SensorTh](device456) / {"temperature":25}>',
        },
      ],
    };

    const dto = plainToInstance(ListLogResponseDto, data);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
    expect(dto.list).toHaveLength(2);
    expect(dto.list[0]).toBeInstanceOf(LogResponseDto);
  });

  it('list가 비어있어도 검증을 통과해야 합니다', async () => {
    const data = {
      list: [],
    };

    const dto = plainToInstance(ListLogResponseDto, data);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
    expect(dto.list).toHaveLength(0);
  });
});
