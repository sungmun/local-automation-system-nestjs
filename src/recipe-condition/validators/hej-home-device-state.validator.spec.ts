import { Test, TestingModule } from '@nestjs/testing';
import { HejHomeDeviceStateValidator } from './hej-home-device-state.validator';
import { DataBaseDeviceService } from '../../device/database-device.service';
import { RecipeConditionType } from '../entities/recipe-condition.entity';
import { ValidationContext } from './validation-context';
import { RecipeConditionHejHomeDeviceState } from '../entities/child-recipe-conditions';
import { Device } from '../../device/entities/device.entity';

describe('HejHomeDeviceStateValidator', () => {
  let validator: HejHomeDeviceStateValidator;
  let deviceService: jest.Mocked<DataBaseDeviceService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HejHomeDeviceStateValidator,
        {
          provide: DataBaseDeviceService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    validator = module.get<HejHomeDeviceStateValidator>(
      HejHomeDeviceStateValidator,
    );
    deviceService = module.get(DataBaseDeviceService);
  });

  it('검증 가능한 클래스가 정의되어야 한다', () => {
    expect(validator).toBeDefined();
  });

  describe('canHandle', () => {
    it('HEJ_HOME_DEVICE_STATE 타입의 조건을 처리할 수 있어야 합니다', () => {
      const condition = {
        type: RecipeConditionType.HEJ_HOME_DEVICE_STATE,
      } as RecipeConditionHejHomeDeviceState;

      expect(validator.canHandle(condition)).toBe(true);
    });

    it('HEJ_HOME_DEVICE_STATE 타입이 아닌 조건은 처리할 수 없어야 합니다', () => {
      const condition = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
      } as RecipeConditionHejHomeDeviceState;

      expect(validator.canHandle(condition)).toBe(false);
    });
  });

  describe('validate', () => {
    it('장치 상태가 모든 조건과 일치하면 true를 반환해야 합니다', async () => {
      const condition = {
        type: RecipeConditionType.HEJ_HOME_DEVICE_STATE,
        deviceId: 1,
        deviceState: {
          power: { value: 'on' },
          temperature: { value: 25, unit: '>' },
          mode: { value: 'auto' },
        },
      } as unknown as RecipeConditionHejHomeDeviceState;

      const device = {
        state: {
          power: 'on',
          temperature: 26,
          mode: 'auto',
        },
      } as unknown as Device;

      deviceService.findOne.mockResolvedValue(device);
      const context = new ValidationContext(condition);
      const result = await validator.validate(context);

      expect(result).toBe(true);
      expect(deviceService.findOne).toHaveBeenCalledWith(1);
    });

    it('장치 상태가 하나라도 일치하지 않으면 false를 반환해야 합니다', async () => {
      const condition = {
        type: RecipeConditionType.HEJ_HOME_DEVICE_STATE,
        deviceId: 1,
        deviceState: {
          power: { value: 'on' },
          temperature: { value: 25, unit: '>' },
        },
      } as unknown as RecipeConditionHejHomeDeviceState;

      const device = {
        state: {
          power: 'off',
          temperature: 24,
        },
      } as unknown as Device;

      deviceService.findOne.mockResolvedValue(device);
      const context = new ValidationContext(condition);
      const result = await validator.validate(context);

      expect(result).toBe(false);
    });

    it('장치 상태에 없는 속성을 검증하면 false를 반환해야 합니다', async () => {
      const condition = {
        type: RecipeConditionType.HEJ_HOME_DEVICE_STATE,
        deviceId: 1,
        deviceState: {
          nonexistentProperty: { value: 'test' },
        },
      } as unknown as RecipeConditionHejHomeDeviceState;

      const device = {
        state: {
          power: 'on',
        },
      } as unknown as Device;

      deviceService.findOne.mockResolvedValue(device);
      const context = new ValidationContext(condition);
      const result = await validator.validate(context);

      expect(result).toBe(false);
    });

    it('숫자 값에 대한 비교 연산자를 올바르게 처리해야 합니다', async () => {
      const testCases = [
        { unit: '>', value: 25, deviceValue: 26, expected: true },
        { unit: '>', value: 25, deviceValue: 24, expected: false },
        { unit: '<', value: 25, deviceValue: 24, expected: true },
        { unit: '<', value: 25, deviceValue: 26, expected: false },
        { unit: '>=', value: 25, deviceValue: 25, expected: true },
        { unit: '<=', value: 25, deviceValue: 25, expected: true },
        { unit: '=', value: 25, deviceValue: 25, expected: true },
        { unit: '=', value: 25, deviceValue: 26, expected: false },
      ];

      for (const testCase of testCases) {
        const condition = {
          type: RecipeConditionType.HEJ_HOME_DEVICE_STATE,
          deviceId: 1,
          deviceState: {
            temperature: { value: testCase.value, unit: testCase.unit },
          },
        } as unknown as RecipeConditionHejHomeDeviceState;

        const device = {
          state: {
            temperature: testCase.deviceValue,
          },
        } as unknown as Device;

        deviceService.findOne.mockResolvedValue(device);
        const context = new ValidationContext(condition);
        const result = await validator.validate(context);

        expect(result).toBe(testCase.expected);
      }
    });
  });
});
