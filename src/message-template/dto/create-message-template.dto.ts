import { IsOptional, IsString } from 'class-validator';

export class CreateMessageTemplateDto {
  @IsString()
  name: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  type: string = 'changed';
}
