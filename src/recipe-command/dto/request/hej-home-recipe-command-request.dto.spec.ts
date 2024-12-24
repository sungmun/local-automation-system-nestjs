import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { HejHomeRecipeCommandRequestDto } from './hej-home-recipe-command-request.dto';
import { RecipeCommandPlatform } from '../../entities/recipe-command.entity';

describe('HejHomeRecipeCommandRequestDto', () => {
  const createValidDto = () => ({
    command: { power: 'on' },
    deviceId: 'device-123',
    name: '전등 켜기',
    platform: RecipeCommandPlatform.HEJ_HOME,
  });

  const validateDto = async (dto: any) => {
    const dtoInstance = plainToInstance(HejHomeRecipeCommandRequestDto, dto);
    return await validate(dtoInstance);
  };

  describe('command 필드 검증', () => {
    it('command가 객체이면 검증을 통과해야 합니다', async () => {
      const dto = createValidDto();
      const errors = await validateDto(dto);
      expect(errors.length).toBe(0);
    });

    it('command가 객체가 아니면 검증에 실패해야 합니다', async () => {
      const dto = {
        ...createValidDto(),
        command: 'invalid-command',
      };
      const errors = await validateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isObject');
    });

    it('command가 비어있으면 검증에 실패해야 합니다', async () => {
      const dto = {
        ...createValidDto(),
        command: undefined,
      };
      const errors = await validateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });

  describe('deviceId 필드 검증', () => {
    it('deviceId가 문자열이면 검증을 통과해야 합니다', async () => {
      const dto = createValidDto();
      const errors = await validateDto(dto);
      expect(errors.length).toBe(0);
    });

    it('deviceId가 비어있으면 검증에 실패해야 합니다', async () => {
      const dto = {
        ...createValidDto(),
        deviceId: '',
      };
      const errors = await validateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('deviceId가 문자열이 아니면 검증에 실패해야 합니다', async () => {
      const dto = {
        ...createValidDto(),
        deviceId: 123,
      };
      const errors = await validateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isString');
    });
  });

  describe('name 필드 검증', () => {
    it('name이 문자열이면 검증을 통과해야 합니다', async () => {
      const dto = createValidDto();
      const errors = await validateDto(dto);
      expect(errors.length).toBe(0);
    });

    it('name이 비어있으면 검증에 실패해야 합니다', async () => {
      const dto = {
        ...createValidDto(),
        name: '',
      };
      const errors = await validateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('name이 문자열이 아니면 검증에 실패해야 합니다', async () => {
      const dto = {
        ...createValidDto(),
        name: 123,
      };
      const errors = await validateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isString');
    });
  });

  describe('platform 필드 검증', () => {
    it('platform이 HEJ_HOME이면 검증을 통과해야 합니다', async () => {
      const dto = createValidDto();
      const errors = await validateDto(dto);
      expect(errors.length).toBe(0);
    });
  });
});
