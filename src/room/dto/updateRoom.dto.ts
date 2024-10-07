import { IsNumber, IsOptional, IsString } from 'class-validate';

export class UpdateRoomDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  acStartTemperature?: number;

  @IsNumber()
  @IsOptional()
  acStopTemperature?: number;

  @IsNumber()
  @IsOptional()
  heatingStartTemperature?: number;

  @IsNumber()
  @IsOptional()
  heatingStopTemperature?: number;
}
