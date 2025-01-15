import { ApiProperty } from '@nestjs/swagger';
import { StatusDelayMaintainConditionDto } from '../../recipe-conditions/status-delay-maintain-condition.dto';
import { RecipeStatus } from '../../../../recipe/entities/recipe.entity';

export class StatusDelayMaintainConditionResponseDto extends StatusDelayMaintainConditionDto {
  @ApiProperty({
    description: '조건 아이디',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '상태',
    example: RecipeStatus.STOPPED,
    enum: RecipeStatus,
  })
  status: RecipeStatus = RecipeStatus.STOPPED;

  @ApiProperty({
    description: '지연 시작 시간',
    example: '2024-01-01T00:00:00Z',
  })
  startDelayTime: Date | null = null;

  @ApiProperty({
    description: '순서',
    example: Number.MAX_VALUE,
  })
  order: number = Number.MAX_VALUE;
}
