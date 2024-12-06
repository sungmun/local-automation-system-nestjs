import { RoomTemperatureConditionResponseDto } from './room-temperature-condition-response.dto';
import { RoomHumidityConditionResponseDto } from './room-humidity-condition-response.dto';
import { ReserveTimeConditionResponseDto } from './reserve-time-condition-response.dto';
import { RecipeConditionReserveTimeRangeResponseDto } from './recipe-condition-reserve-time-range-response.dto';
import { WeeklyRecurringScheduleConditionResponseDto } from './weekly-recurring-schedule-condition-response.dto';
import { WeeklyRecurringScheduleTimeRangeConditionResponseDto } from './weekly-recurring-schedule-time-range-condition-response.dto';
import { RecipeConditionGroupDto } from '../recipe-condition-group.dto';

export class RecipeConditionGroupResponseDto extends RecipeConditionGroupDto {
  id: number;
  conditions: (
    | RoomTemperatureConditionResponseDto
    | RoomHumidityConditionResponseDto
    | ReserveTimeConditionResponseDto
    | RecipeConditionReserveTimeRangeResponseDto
    | WeeklyRecurringScheduleConditionResponseDto
    | WeeklyRecurringScheduleTimeRangeConditionResponseDto
  )[];
}
