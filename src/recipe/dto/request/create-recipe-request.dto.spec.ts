import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateRecipeRequestDto } from './create-recipe-request.dto';

describe('CreateRecipeRequestDto', () => {
  it('유효한 CreateRecipeRequestDto를 검증해야 합니다', async () => {
    const recipeCommand = {
      command: { test: 'test' },
      deviceId: 'device123',
      name: '장치 명령',
      platform: 'device-hejhome',
    };

    const recipeGroup = {
      conditions: [],
      operator: 'AND',
    };

    const recipe = {
      name: '레시피 이름',
      description: '레시피 설명',
      type: '유형',
      active: true,
      recipeCommands: [recipeCommand],
      recipeGroups: [recipeGroup],
    };

    const errors = await validate(
      plainToInstance(CreateRecipeRequestDto, recipe),
    );
    expect(errors.length).toBe(0);
  });

  it('name이 비어 있으면 검증에 실패해야 합니다', async () => {
    const recipe = {
      description: '레시피 설명',
      type: '유형',
      active: true,
      deviceCommands: [],
    };

    const errors = await validate(
      plainToInstance(CreateRecipeRequestDto, recipe),
    );
    expect(errors.length).toBeGreaterThan(0);
  });
});
