import { plainToInstance } from 'class-transformer';
import { HejHomeRecipeCommandResponseDto } from './hej-home-recipe-command-response.dto';

describe('HejHomeRecipeCommandResponseDto', () => {
  it('DTO가 올바르게 변환되어야 합니다', () => {
    const plain = {
      id: 1,
      deviceId: 'device-1',
      name: '장치 명령',
      command: { power: 'on' },
      platform: 'hejhome',
      order: 1,
    };

    const dto = plainToInstance(HejHomeRecipeCommandResponseDto, plain);

    expect(dto.id).toBe(1);
    expect(dto.deviceId).toBe('device-1');
    expect(dto.name).toBe('장치 명령');
    expect(dto.command).toEqual({ power: 'on' });
    expect(dto.platform).toBe('hejhome');
    expect(dto.order).toBe(1);
  });
});
