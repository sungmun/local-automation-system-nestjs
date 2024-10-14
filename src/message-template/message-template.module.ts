import { Module } from '@nestjs/common';
import { MessageTemplateService } from './message-template.service';
import { MessageTemplateController } from './message-template.controller';

@Module({
  controllers: [MessageTemplateController],
  providers: [MessageTemplateService],
})
export class MessageTemplateModule {}
