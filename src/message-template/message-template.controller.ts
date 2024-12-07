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
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('메시지 템플릿')
@Controller('message-templates')
export class MessageTemplateController {
  constructor(
    private readonly messageTemplateService: MessageTemplateService,
  ) {}

  @ApiOperation({ summary: '메시지 템플릿 생성' })
  @ApiCreatedResponse({
    description: '메시지 템플릿이 생성되었습니다.',
    type: CreateMessageTemplateResponseDto,
  })
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

  @ApiOperation({ summary: '메시지 템플릿 목록 조회' })
  @ApiOkResponse({
    description: '메시지 템플릿 목록을 조회했습니다.',
    type: ListMessageTemplateResponseDto,
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const result = await this.messageTemplateService.findAll();
    return plainToInstance(ListMessageTemplateResponseDto, { list: result });
  }

  @ApiOperation({ summary: '메시지 템플릿 상세 조회' })
  @ApiOkResponse({
    description: '메시지 템플릿을 조회했습니다.',
    type: DetailMessageTemplateResponseDto,
  })
  @Get(':messageTemplateId')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('messageTemplateId') id: string) {
    const result = await this.messageTemplateService.findOne(id);
    return plainToInstance(DetailMessageTemplateResponseDto, result);
  }

  @ApiOperation({ summary: '메시지 템플릿 수정' })
  @ApiNoContentResponse({
    description: '메시지 템플릿이 수정되었습니다.',
  })
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
