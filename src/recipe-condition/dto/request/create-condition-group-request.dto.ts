import { IsNotEmpty, IsIn, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseRecipeConditionRequestDto } from './base-recipe-condition-request.dto';
import { RoomTemperatureConditionRequestDto } from './room-temperature-condition-request.dto';
import { RoomHumidityConditionRequestDto } from './room-humidity-condition-request.dto';
import { ReserveTimeConditionRequestDto } from './reserve-time-condition-request.dto';
import { RecipeConditionReserveTimeRangeRequestDto } from './recipe-condition-reserve-time-range-request.dto';
import { WeeklyRecurringScheduleConditionRequestDto } from './weekly-recurring-schedule-condition-request.dto';

export class CreateRecipeConditionGroupRequestDto {
  @IsIn(['AND', 'OR'])
  @IsNotEmpty()
  operator: 'AND' | 'OR';

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
      ],
    },
  })
  conditions: (
    | RoomTemperatureConditionRequestDto
    | RoomHumidityConditionRequestDto
    | ReserveTimeConditionRequestDto
    | RecipeConditionReserveTimeRangeRequestDto
    | WeeklyRecurringScheduleConditionRequestDto
  )[];
}
