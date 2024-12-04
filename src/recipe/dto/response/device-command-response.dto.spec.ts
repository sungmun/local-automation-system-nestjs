import { DeviceCommandResponseDto } from './device-command-response.dto';
import { plainToInstance } from 'class-transformer';

describe('DeviceCommandResponseDto', () => {
  it('DTO가 올바르게 변환되어야 합니다', () => {
    const plain = {
      id: 1,
      deviceId: 'device-1',
      name: '장치 명령',
      command: { power: 'on' },
      platform: 'platform-1',
      order: 1,
    };

    const dto = plainToInstance(DeviceCommandResponseDto, plain);

    expect(dto.id).toBe(1);
    expect(dto.deviceId).toBe('device-1');
    expect(dto.name).toBe('장치 명령');
    expect(dto.command).toEqual({ power: 'on' });
    expect(dto.platform).toBe('platform-1');
    expect(dto.order).toBe(1);
  });
});
