import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { DataBaseDeviceService } from './database-device.service';
import { plainToInstance } from 'class-transformer';
import {
  DetailDeviceResponseDto,
  ListDeviceResponseDto,
  ConnectDeviceToMessageTemplateResponseDto,
} from './dto/response';
import {
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiTags,
  ApiOkResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';

@ApiTags('장치')
@Controller('/devices')
export class DeviceController {
  constructor(private readonly databaseDeviceService: DataBaseDeviceService) {}

  @ApiOperation({ summary: '장치 상세 조회' })
  @ApiParam({ name: 'id', description: '장치 ID' })
  @ApiOkResponse({
    description: '장치 상세 정보를 반환합니다.',
    type: DetailDeviceResponseDto,
  })
  @Get('/:id')
  async detailDevice(@Param('id') id: string) {
    const result = await this.databaseDeviceService.findOne(id, [
      'messageTemplates',
      'room',
    ]);
    return plainToInstance(DetailDeviceResponseDto, result);
  }

  @ApiOperation({ summary: '장치 활성화 상태 변경' })
  @ApiParam({ name: 'id', description: '장치 ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        active: {
          type: 'boolean',
          description: '활성화 상태',
        },
      },
    },
  })
  @ApiNoContentResponse({
    description: '장치 활성화 상태가 변경되었습니다.',
  })
  @Patch('/:id/active')
  async updateActive(
    @Param('id') id: string,
    @Body('active') active: boolean,
  ): Promise<void> {
    await this.databaseDeviceService.updateActive(id, active);
  }

  @ApiOperation({ summary: '장치 메시지 템플릿 활성화 상태 변경' })
  @ApiParam({ name: 'id', description: '장치 ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        activeMessageTemplate: {
          type: 'boolean',
          description: '메시지 템플릿 활성화 상태',
        },
      },
    },
  })
  @ApiNoContentResponse({
    description: '메시지 템플릿 활성화 상태가 변경되었습니다.',
  })
  @Patch('/:id/active-message-template')
  async updateActiveMessageTemplate(
    @Param('id') id: string,
    @Body('activeMessageTemplate') activeMessageTemplate: boolean,
  ): Promise<void> {
    await this.databaseDeviceService.updateActiveMessageTemplate(
      id,
      activeMessageTemplate,
    );
  }

  @ApiOperation({ summary: '장치 목록 조회' })
  @ApiOkResponse({
    description: '장치 목록을 반환합니다.',
    type: ListDeviceResponseDto,
  })
  @Get('/')
  async getDevices() {
    const result = await this.databaseDeviceService.findAll();
    return plainToInstance(ListDeviceResponseDto, { list: result });
  }

  @ApiOperation({ summary: '장치에 메시지 템플릿 연결' })
  @ApiParam({ name: 'id', description: '장치 ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        templateId: {
          type: 'string',
          description: '메시지 템플릿 ID',
        },
      },
    },
  })
  @ApiOkResponse({
    description: '메시지 템플릿이 연결되었습니다.',
    type: ConnectDeviceToMessageTemplateResponseDto,
  })
  @Post('/:id/message-template')
  async connectMessageTemplate(
    @Param('id') id: string,
    @Body('templateId') templateId: string,
  ): Promise<ConnectDeviceToMessageTemplateResponseDto> {
    const result = await this.databaseDeviceService.connectMessageTemplate(
      id,
      templateId,
    );
    return plainToInstance(ConnectDeviceToMessageTemplateResponseDto, result);
  }
}
