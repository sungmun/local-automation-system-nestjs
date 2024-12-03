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
import {
  CreateMessageTemplateRequestDto,
  UpdateMessageTemplateRequestDto,
} from './dto/request';
import {
  DetailMessageTemplateResponseDto,
  CreateMessageTemplateResponseDto,
  ListMessageTemplateResponseDto,
} from './dto/response';

@Controller('message-templates')
export class MessageTemplateController {
  constructor(
    private readonly messageTemplateService: MessageTemplateService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createMessageTemplateDto: CreateMessageTemplateRequestDto,
  ) {
    const result = await this.messageTemplateService.create(
      createMessageTemplateDto,
    );
    return plainToInstance(CreateMessageTemplateResponseDto, result);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const result = await this.messageTemplateService.findAll();
    return plainToInstance(ListMessageTemplateResponseDto, { list: result });
  }

  @Get(':messageTemplateId')
  @HttpCode(HttpStatus.OK)
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
