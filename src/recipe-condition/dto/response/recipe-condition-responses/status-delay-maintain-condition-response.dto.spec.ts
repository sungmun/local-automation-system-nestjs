import { StatusDelayMaintainConditionResponseDto } from './status-delay-maintain-condition-response.dto';
import { RecipeConditionType } from '../../../entities/recipe-condition.entity';
import { RecipeStatus } from '../../../../recipe/entities/recipe.entity';
import { plainToInstance } from 'class-transformer';

describe('StatusDelayMaintainConditionResponseDto', () => {
  it('DTO가 올바르게 변환되어야 합니다', () => {
    const now = new Date('2024-01-01T10:00:00.000Z');
    const plain = {
      id: 1,
      type: RecipeConditionType.STATUS_DELAY_MAINTAIN,
      status: RecipeStatus.RUNNING,
      startDelayTime: now,
      delayTime: 60,
    };

    const dto = plainToInstance(StatusDelayMaintainConditionResponseDto, plain);

    expect(dto.id).toBe(1);
    expect(dto.type).toBe(RecipeConditionType.STATUS_DELAY_MAINTAIN);
    expect(dto.status).toBe(RecipeStatus.RUNNING);
    expect(dto.startDelayTime).toEqual(now);
    expect(dto.delayTime).toBe(60);
  });

  it('status가 없는 경우 STOPPED로 설정되어야 합니다', () => {
    const plain = {
      id: 1,
      type: RecipeConditionType.STATUS_DELAY_MAINTAIN,
      delayTime: 60,
    };

    const dto = plainToInstance(StatusDelayMaintainConditionResponseDto, plain);

    expect(dto.status).toBe(RecipeStatus.STOPPED);
  });

  it('startDelayTime이 없는 경우 null로 설정되어야 합니다', () => {
    const plain = {
      id: 1,
      type: RecipeConditionType.STATUS_DELAY_MAINTAIN,
      status: RecipeStatus.STOPPED,
      delayTime: 60,
    };

    const dto = plainToInstance(StatusDelayMaintainConditionResponseDto, plain);

    expect(dto.startDelayTime).toBeNull();
  });
});
