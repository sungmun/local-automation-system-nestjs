import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { MessageTemplateService } from './message-template.service';
import { CreateMessageTemplateDto } from './dto/create-message-template.dto';
import { UpdateMessageTemplateDto } from './dto/update-message-template.dto';

@Controller('message-templates')
export class MessageTemplateController {
  constructor(
    private readonly messageTemplateService: MessageTemplateService,
  ) {}

  @Post()
  create(@Body() createMessageTemplateDto: CreateMessageTemplateDto) {
    return this.messageTemplateService.create(createMessageTemplateDto);
  }

  @Get()
  findAll() {
    return this.messageTemplateService.findAll();
  }

  @Get(':messageTemplateId')
  findOne(@Param('messageTemplateId') id: string) {
    return this.messageTemplateService.findOne(id);
  }

  @Patch(':messageTemplateId')
  update(
    @Param('messageTemplateId') id: string,
    @Body() updateMessageTemplateDto: UpdateMessageTemplateDto,
  ) {
    return this.messageTemplateService.update(id, updateMessageTemplateDto);
  }
}
