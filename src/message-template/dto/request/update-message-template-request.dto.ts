import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageTemplateRequestDto } from './create-message-template-request.dto';

export class UpdateMessageTemplateRequestDto extends PartialType(
  CreateMessageTemplateRequestDto,
) {}
