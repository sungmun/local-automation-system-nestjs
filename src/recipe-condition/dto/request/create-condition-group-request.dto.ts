import { IsNotEmpty, IsIn, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import * as RequestDtos from './recipe-condition-requests';
import { RecipeConditionGroupDto } from '../recipe-condition-group.dto';
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { BaseRecipeConditionRequestDto } from './base-recipe-condition-request.dto';
import { RecipeConditionType } from '../../entities/recipe-condition.entity';
import { IsArrayUniqType } from '../../../common/validators';

const CONDITION_TYPE_MAPPING = {
  [RecipeConditionType.ROOM_TEMPERATURE]:
    RequestDtos.RoomTemperatureConditionRequestDto,
  [RecipeConditionType.ROOM_HUMIDITY]:
    RequestDtos.RoomHumidityConditionRequestDto,
  [RecipeConditionType.RESERVE_TIME]:
    RequestDtos.ReserveTimeConditionRequestDto,
  [RecipeConditionType.RESERVE_TIME_RANGE]:
    RequestDtos.ReserveTimeRangeConditionRequestDto,
  [RecipeConditionType.WEEKLY_RECURRING_SCHEDULE]:
    RequestDtos.WeeklyRecurringScheduleConditionRequestDto,
  [RecipeConditionType.WEEKLY_RECURRING_SCHEDULE_TIME_RANGE]:
    RequestDtos.WeeklyRecurringScheduleTimeRangeConditionRequestDto,
  [RecipeConditionType.DAILY_RECURRING_SCHEDULE]:
    RequestDtos.DailyRecurringScheduleConditionRequestDto,
  [RecipeConditionType.DAILY_RECURRING_SCHEDULE_TIME_RANGE]:
    RequestDtos.DailyRecurringScheduleTimeRangeConditionRequestDto,
  [RecipeConditionType.STATUS_DELAY_MAINTAIN]:
    RequestDtos.StatusDelayMaintainConditionRequestDto,
} as const;

@ApiExtraModels(...Object.values(RequestDtos))
export class CreateRecipeConditionGroupRequestDto extends RecipeConditionGroupDto {
  @IsIn(['AND', 'OR'])
  @IsNotEmpty()
  operator: 'AND' | 'OR';

  @ApiProperty({
    description: '레시피 조건 목록',
    type: 'array',
    items: {
      oneOf: Object.entries(CONDITION_TYPE_MAPPING).map(([, dto]) => ({
        type: 'object',
        $ref: getSchemaPath(dto),
      })),
    },
  })
  @IsArray()
  @ValidateNested({ each: true })
  @IsArrayUniqType(
    CONDITION_TYPE_MAPPING[RecipeConditionType.STATUS_DELAY_MAINTAIN],
  )
  @Type(() => BaseRecipeConditionRequestDto, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'type',
      subTypes: Object.entries(CONDITION_TYPE_MAPPING).map(([type, dto]) => ({
        value: dto,
        name: type,
      })),
    },
  })
  conditions: InstanceType<
    (typeof CONDITION_TYPE_MAPPING)[keyof typeof CONDITION_TYPE_MAPPING]
  >[];
}
