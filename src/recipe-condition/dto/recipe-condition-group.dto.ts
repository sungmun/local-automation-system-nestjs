import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { RoomTemperatureConditionDto } from './room-temperature-condition.dto';
import { RoomHumidityConditionDto } from './room-humidity-condition.dto';
import { ReserveTimeConditionDto } from './reserve-time-condition.dto';
import { RecipeConditionReserveTimeRangeDto } from './recipe-condition-reserve-time-range.dto';
import { WeeklyRecurringScheduleConditionDto } from './weekly-recurring-schedule-condition.dto';
import { WeeklyRecurringScheduleTimeRangeConditionDto } from './weekly-recurring-schedule-time-range-condition.dto';

@ApiExtraModels(
  RoomTemperatureConditionDto,
  RoomHumidityConditionDto,
  ReserveTimeConditionDto,
  RecipeConditionReserveTimeRangeDto,
  WeeklyRecurringScheduleConditionDto,
  WeeklyRecurringScheduleTimeRangeConditionDto,
)
export class RecipeConditionGroupDto {
  @ApiProperty({
    description: '조건 연산자',
    example: 'AND',
    enum: ['AND', 'OR'],
  })
  operator: 'AND' | 'OR';

  @ApiProperty({
    description: '레시피 조건 목록',
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(RoomTemperatureConditionDto) },
        { $ref: getSchemaPath(RoomHumidityConditionDto) },
        { $ref: getSchemaPath(ReserveTimeConditionDto) },
        { $ref: getSchemaPath(RecipeConditionReserveTimeRangeDto) },
        { $ref: getSchemaPath(WeeklyRecurringScheduleConditionDto) },
        {
          $ref: getSchemaPath(WeeklyRecurringScheduleTimeRangeConditionDto),
        },
      ],
    },
  })
  conditions: (
    | RoomTemperatureConditionDto
    | RoomHumidityConditionDto
    | ReserveTimeConditionDto
    | RecipeConditionReserveTimeRangeDto
    | WeeklyRecurringScheduleConditionDto
    | WeeklyRecurringScheduleTimeRangeConditionDto
  )[];
}
