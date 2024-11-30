import { IsOptional, IsString } from 'class-validator';
import { MessageTemplateDto } from '../message-template.dto';

export class CreateMessageTemplateRequestDto extends MessageTemplateDto {
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
