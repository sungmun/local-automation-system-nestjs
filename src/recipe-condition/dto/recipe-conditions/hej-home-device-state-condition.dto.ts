import { BaseRecipeConditionDto } from '../base-recipe-condition.dto';
import { RecipeConditionType } from '../../entities/recipe-condition.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ComparisonOperator } from '../../validators/base.validator';

export class HejHomeDeviceStateConditionDto extends BaseRecipeConditionDto {
  @ApiProperty({
    description: '조건 타입',
    enum: RecipeConditionType,
    example: RecipeConditionType.HEJ_HOME_DEVICE_STATE,
  })
  type: RecipeConditionType.HEJ_HOME_DEVICE_STATE;

  @ApiProperty({
    description: '디바이스 상태',
    example: {
      power: { unit: '=', value: 'on' },
      temperature: { unit: '>', value: 25 },
    },
  })
  deviceState: Record<
    string,
    {
      unit: ComparisonOperator;
      value: string | number;
    }
  >;

  @ApiProperty({
    description: '디바이스 ID',
    example: 'device-123',
  })
  deviceId: string;
}
