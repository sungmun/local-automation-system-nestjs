import { validate } from 'class-validator';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { CreateDeviceCommandRequestDto } from './create-device-command-request.dto';

describe('CreateDeviceCommandRequestDto', () => {
  it('유효한 CreateDeviceCommandRequestDto를 검증해야 합니다', async () => {
    const deviceCommand = {
      command: { test: 'test' },
      deviceId: 'device123',
      name: '장치 명령',
      platform: 'platform',
    };

    const errors = await validate(
      plainToInstance(CreateDeviceCommandRequestDto, deviceCommand),
    );

    expect(errors.length).toBe(0);
  });

  it('command가 object가 아니면 검증에 실패해야 합니다', async () => {
    const deviceCommand = {
      command: 'test',
      deviceId: 'device123',
      name: '장치 명령',
      platform: 'platform',
    };

    const errors = await validate(
      plainToInstance(CreateDeviceCommandRequestDto, deviceCommand),
    );

    expect(errors.length).toBeGreaterThan(0);
  });

  it('유효한 command 가 문자열로 정상적으로 변환되는것을 검증해야 합니다', async () => {
    const deviceCommand = {
      command: { test: 'test' },
      deviceId: 'device123',
      name: '장치 명령',
      platform: 'platform',
    };

    const instance = plainToInstance(
      CreateDeviceCommandRequestDto,
      deviceCommand,
    );
    expect(instanceToPlain(instance).command).toEqual(
      JSON.stringify(deviceCommand.command),
    );
  });
});
