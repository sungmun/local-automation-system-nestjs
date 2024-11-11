import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateRecipeDto } from './create-recipe.dto';

describe('CreateRecipeDto', () => {
  it('유효한 CreateRecipeDto를 검증해야 합니다', async () => {
    const deviceCommand = {
      command: { test: 'test' },
      deviceId: 'device123',
      name: '장치 명령',
      platform: 'platform',
    };

    const recipe = {
      name: '레시피 이름',
      description: '레시피 설명',
      type: '유형',
      active: true,
      deviceCommands: [deviceCommand],
    };

    const errors = await validate(plainToInstance(CreateRecipeDto, recipe));
    expect(errors.length).toBe(0);
  });

  it('name이 비어 있으면 검증에 실패해야 합니다', async () => {
    const recipe = {
      description: '레시피 설명',
      type: '유형',
      active: true,
      deviceCommands: [],
    };

    const errors = await validate(plainToInstance(CreateRecipeDto, recipe));
    expect(errors.length).toBeGreaterThan(0);
  });
});
