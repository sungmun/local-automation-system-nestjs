import { HejHomeDeviceStateConditionResponseDto } from './hej-home-device-state-condition-response.dto';
import { RecipeConditionType } from '../../../entities/recipe-condition.entity';
import { plainToInstance } from 'class-transformer';

describe('HejHomeDeviceStateConditionResponseDto', () => {
  it('DTO가 올바르게 변환되어야 합니다', () => {
    const plain = {
      id: 1,
      type: RecipeConditionType.HEJ_HOME_DEVICE_STATE,
      deviceState: {
        power: { unit: '=', value: 'on' },
        temperature: { unit: '>', value: 25 },
      },
      deviceId: 'device-123',
      order: 0,
    };

    const dto = plainToInstance(HejHomeDeviceStateConditionResponseDto, plain);

    expect(dto.id).toBe(1);
    expect(dto.type).toBe(RecipeConditionType.HEJ_HOME_DEVICE_STATE);
    expect(dto.deviceState).toEqual({
      power: { unit: '=', value: 'on' },
      temperature: { unit: '>', value: 25 },
    });
    expect(dto.deviceId).toBe('device-123');
    expect(dto.order).toBe(0);
  });
});
