import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import {
  RoomTemperatureConditionResponseDto,
  RoomHumidityConditionResponseDto,
  ReserveTimeConditionResponseDto,
  RecipeConditionReserveTimeRangeResponseDto,
  WeeklyRecurringScheduleConditionResponseDto,
  WeeklyRecurringScheduleTimeRangeConditionResponseDto,
  DailyRecurringScheduleConditionResponseDto,
} from './';
import { RecipeConditionGroupDto } from '../recipe-condition-group.dto';

@ApiExtraModels(
  RoomTemperatureConditionResponseDto,
  RoomHumidityConditionResponseDto,
  ReserveTimeConditionResponseDto,
  RecipeConditionReserveTimeRangeResponseDto,
  WeeklyRecurringScheduleConditionResponseDto,
  WeeklyRecurringScheduleTimeRangeConditionResponseDto,
  DailyRecurringScheduleConditionResponseDto,
)
export class RecipeConditionGroupResponseDto extends RecipeConditionGroupDto {
  @ApiProperty({
    description: '그룹 아이디',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '레시피 조건 목록',
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(RoomTemperatureConditionResponseDto) },
        { $ref: getSchemaPath(RoomHumidityConditionResponseDto) },
        { $ref: getSchemaPath(ReserveTimeConditionResponseDto) },
        {
          $ref: getSchemaPath(RecipeConditionReserveTimeRangeResponseDto),
        },
        {
          $ref: getSchemaPath(WeeklyRecurringScheduleConditionResponseDto),
        },
        {
          $ref: getSchemaPath(
            WeeklyRecurringScheduleTimeRangeConditionResponseDto,
          ),
        },
        {
          $ref: getSchemaPath(DailyRecurringScheduleConditionResponseDto),
        },
      ],
    },
  })
  conditions: (
    | RoomTemperatureConditionResponseDto
    | RoomHumidityConditionResponseDto
    | ReserveTimeConditionResponseDto
    | RecipeConditionReserveTimeRangeResponseDto
    | WeeklyRecurringScheduleConditionResponseDto
    | WeeklyRecurringScheduleTimeRangeConditionResponseDto
    | DailyRecurringScheduleConditionResponseDto
  )[];
}
