import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MessageTemplateService } from './message-template.service';
import { plainToInstance } from 'class-transformer';
import { CreateMessageTemplateRequestDto } from './dto/request/create-message-template-request.dto';
import { UpdateMessageTemplateRequestDto } from './dto/request/update-message-template-request.dto';
import { DetailMessageTemplateResponseDto } from './dto/response/detail-message-template-response.dto';
import { CreateMessageTemplateResponseDto } from './dto/response/create-message-template-response.dto';
import { ListMessageTemplateResponseDto } from './dto/response/list-message-template-response.dto';

@Controller('message-templates')
export class MessageTemplateController {
  constructor(
    private readonly messageTemplateService: MessageTemplateService,
  ) {}

  @Post()
  async create(
    @Body() createMessageTemplateDto: CreateMessageTemplateRequestDto,
  ) {
    const result = await this.messageTemplateService.create(
      createMessageTemplateDto,
    );
    return plainToInstance(CreateMessageTemplateResponseDto, result);
  }

  @Get()
  async findAll() {
    const result = await this.messageTemplateService.findAll();
    return plainToInstance(ListMessageTemplateResponseDto, { list: result });
  }

  @Get(':messageTemplateId')
  async findOne(@Param('messageTemplateId') id: string) {
    const result = await this.messageTemplateService.findOne(id);
    return plainToInstance(DetailMessageTemplateResponseDto, result);
  }

  @Patch(':messageTemplateId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('messageTemplateId') id: string,
    @Body() updateMessageTemplateDto: UpdateMessageTemplateRequestDto,
  ) {
    await this.messageTemplateService.update(id, updateMessageTemplateDto);
    return null;
  }
}
