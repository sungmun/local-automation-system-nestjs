import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class UpdateRoomDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @Min(20)
  @Max(30)
  @IsOptional()
  acStartTemperature?: number;

  @IsNumber()
  @Min(20)
  @Max(30)
  @IsOptional()
  acStopTemperature?: number;

  @IsNumber()
  @Min(16)
  @Max(25)
  @IsOptional()
  heatingStartTemperature?: number;

  @IsNumber()
  @Min(16)
  @Max(25)
  @IsOptional()
  heatingStopTemperature?: number;
}
