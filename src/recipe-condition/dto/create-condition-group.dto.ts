import { IsNotEmpty, IsIn, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseRecipeConditionDto } from './base-recipe-condition.dto';
import { RoomTemperatureConditionDto } from './room-temperature-condition.dto';
import { RoomHumidityConditionDto } from './room-humidity-condition.dto';
import { ReserveTimeConditionDto } from './reserve-time-condition.dto';
import { RecipeConditionReserveTimeRangeDto } from './recipe-condition-reserve-time-range.dto';

export class CreateRecipeConditionGroupDto {
  @IsIn(['AND', 'OR'])
  @IsNotEmpty()
  operator: 'AND' | 'OR';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BaseRecipeConditionDto, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'type',
      subTypes: [
        { value: RoomTemperatureConditionDto, name: 'ROOM_TEMPERATURE' },
        { value: RoomHumidityConditionDto, name: 'ROOM_HUMIDITY' },
        { value: ReserveTimeConditionDto, name: 'RESERVE_TIME' },
        {
          value: RecipeConditionReserveTimeRangeDto,
          name: 'RESERVE_TIME_RANGE',
        },
      ],
    },
  })
  conditions: (
    | RoomTemperatureConditionDto
    | RoomHumidityConditionDto
    | ReserveTimeConditionDto
    | RecipeConditionReserveTimeRangeDto
  )[];
}
