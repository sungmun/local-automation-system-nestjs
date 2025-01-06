import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { HejHomeDeviceStateConditionRequestDto } from './hej-home-device-state-condition-request.dto';
import { RecipeConditionType } from '../../../entities/recipe-condition.entity';

describe('HejHomeDeviceStateConditionRequestDto', () => {
  const createAndValidateDto = async (dto: any) => {
    const dtoInstance = plainToInstance(
      HejHomeDeviceStateConditionRequestDto,
      dto,
    );
    return await validate(dtoInstance);
  };

  describe('디바이스 상태(deviceState) 필드 검증', () => {
    it('유효한 디바이스 상태가 주어지면 검증을 통과해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.HEJ_HOME_DEVICE_STATE,
        deviceState: {
          power: { unit: '=', value: 'on' },
          temperature: { unit: '>', value: 25 },
        },
        deviceId: 'device-123',
      };

      const errors = await createAndValidateDto(dto);

      expect(errors.length).toBe(0);
    });

    it('디바이스 상태의 unit 값이 누락이 되면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.HEJ_HOME_DEVICE_STATE,
        deviceState: {
          power: { value: 'on' },
        },
        deviceId: 'device-123',
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);

      expect(errors[0].constraints).toHaveProperty('isRecordTypeValid');
    });

    it('디바이스 상태의 value 값이 누락이 되면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.HEJ_HOME_DEVICE_STATE,
        deviceState: {
          power: { unit: '=' },
        },
        deviceId: 'device-123',
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isRecordTypeValid');
    });

    it('디바이스 상태가 누락되면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.HEJ_HOME_DEVICE_STATE,
        deviceId: 'device-123',
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });

  describe('디바이스 ID(deviceId) 필드 검증', () => {
    it('유효한 디바이스 ID가 주어지면 검증을 통과해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.HEJ_HOME_DEVICE_STATE,
        deviceState: {
          power: { unit: '=', value: 'on' },
        },
        deviceId: 'device-123',
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBe(0);
    });

    it('디바이스 ID가 누락되면 검증에 실패해야 합니다', async () => {
      const dto = {
        type: RecipeConditionType.HEJ_HOME_DEVICE_STATE,
        deviceState: {
          power: { unit: '=', value: 'on' },
        },
      };

      const errors = await createAndValidateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });
});
