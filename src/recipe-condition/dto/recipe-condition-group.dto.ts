import { RoomTemperatureConditionDto } from './room-temperature-condition.dto';
import { RoomHumidityConditionDto } from './room-humidity-condition.dto';
import { ReserveTimeConditionDto } from './reserve-time-condition.dto';
import { RecipeConditionReserveTimeRangeDto } from './recipe-condition-reserve-time-range.dto';
import { WeeklyRecurringScheduleConditionDto } from './weekly-recurring-schedule-condition.dto';
import { WeeklyRecurringScheduleTimeRangeConditionDto } from './weekly-recurring-schedule-time-range-condition.dto';

export class RecipeConditionGroupDto {
  operator: 'AND' | 'OR';

  conditions: (
    | RoomTemperatureConditionDto
    | RoomHumidityConditionDto
    | ReserveTimeConditionDto
    | RecipeConditionReserveTimeRangeDto
    | WeeklyRecurringScheduleConditionDto
    | WeeklyRecurringScheduleTimeRangeConditionDto
  )[];
}
