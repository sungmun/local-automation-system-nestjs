import { IsNotEmpty, IsNumber, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { RoomTemperatureConditionDto } from '../../recipe-conditions/room-temperature-condition.dto';

export class RoomTemperatureConditionRequestDto extends RoomTemperatureConditionDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => value * 100)
  temperature: number;

  @IsIn(['<', '>', '=', '>=', '<='])
  @IsNotEmpty()
  unit: '<' | '>' | '=' | '>=' | '<=';

  @IsNotEmpty()
  @IsNumber()
  roomId: number;
}
