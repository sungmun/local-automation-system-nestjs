import { IsNotEmpty, IsIn, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import {
  BaseRecipeConditionRequestDto,
  RoomHumidityConditionRequestDto,
  RoomTemperatureConditionRequestDto,
  ReserveTimeConditionRequestDto,
  RecipeConditionReserveTimeRangeRequestDto,
  WeeklyRecurringScheduleConditionRequestDto,
} from './';
import { RecipeConditionGroupDto } from '../recipe-condition-group.dto';
import { ApiProperty, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { WeeklyRecurringScheduleTimeRangeConditionRequestDto } from './weekly-recurring-schedule-time-range-condition-request.dto';

@ApiExtraModels(
  BaseRecipeConditionRequestDto,
  RoomTemperatureConditionRequestDto,
  RoomHumidityConditionRequestDto,
  ReserveTimeConditionRequestDto,
  RecipeConditionReserveTimeRangeRequestDto,
  WeeklyRecurringScheduleConditionRequestDto,
  WeeklyRecurringScheduleTimeRangeConditionRequestDto,
)
export class CreateRecipeConditionGroupRequestDto extends RecipeConditionGroupDto {
  @IsIn(['AND', 'OR'])
  @IsNotEmpty()
  operator: 'AND' | 'OR';

  @ApiProperty({
    description: '레시피 조건 목록',
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(RoomTemperatureConditionRequestDto) },
        { $ref: getSchemaPath(RoomHumidityConditionRequestDto) },
        { $ref: getSchemaPath(ReserveTimeConditionRequestDto) },
        {
          $ref: getSchemaPath(RecipeConditionReserveTimeRangeRequestDto),
        },
        {
          $ref: getSchemaPath(WeeklyRecurringScheduleConditionRequestDto),
        },
        {
          $ref: getSchemaPath(
            WeeklyRecurringScheduleTimeRangeConditionRequestDto,
          ),
        },
      ],
    },
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BaseRecipeConditionRequestDto, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'type',
      subTypes: [
        { value: RoomTemperatureConditionRequestDto, name: 'ROOM_TEMPERATURE' },
        { value: RoomHumidityConditionRequestDto, name: 'ROOM_HUMIDITY' },
        { value: ReserveTimeConditionRequestDto, name: 'RESERVE_TIME' },
        {
          value: RecipeConditionReserveTimeRangeRequestDto,
          name: 'RESERVE_TIME_RANGE',
        },
        {
          value: WeeklyRecurringScheduleConditionRequestDto,
          name: 'WEEKLY_RECURRING_SCHEDULE',
        },
        {
          value: WeeklyRecurringScheduleTimeRangeConditionRequestDto,
          name: 'WEEKLY_RECURRING_SCHEDULE_TIME_RANGE',
        },
      ],
    },
  })
  conditions: (
    | RoomTemperatureConditionRequestDto
    | RoomHumidityConditionRequestDto
    | ReserveTimeConditionRequestDto
    | RecipeConditionReserveTimeRangeRequestDto
    | WeeklyRecurringScheduleConditionRequestDto
    | WeeklyRecurringScheduleTimeRangeConditionRequestDto
  )[];
}
