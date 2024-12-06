import { IsNotEmpty, IsNumber, IsIn } from 'class-validator';
import { RoomHumidityConditionDto } from '../room-humidity-condition.dto';

export class RoomHumidityConditionRequestDto extends RoomHumidityConditionDto {
  @IsNotEmpty()
  @IsNumber()
  humidity: number;

  @IsIn(['<', '>', '=', '>=', '<='])
  @IsNotEmpty()
  unit: '<' | '>' | '=' | '>=' | '<=';

  @IsNotEmpty()
  @IsNumber()
  roomId: number;
}
