import { IsOptional, IsString } from 'class-validator';

export class CreateMessageTemplateDto {
  @IsString()
  name: string;

  @IsString()
  body: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  type: string = 'changed';
}
