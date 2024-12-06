import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { DataBaseDeviceService } from './database-device.service';
import { plainToInstance } from 'class-transformer';
import { DetailDeviceResponseDto } from './dto/response/detail-device-response.dto';
import { ListDeviceResponseDto } from './dto/response/list-device-response.dto';
import { ConnectDeviceToMessageTemplateResponseDto } from './dto/response/connect-device-to-message-template-response.dto';

@Controller('/devices')
export class DeviceController {
  constructor(private readonly databaseDeviceService: DataBaseDeviceService) {}

  @Get('/:id')
  async detailDevice(@Param('id') id: string) {
    const result = await this.databaseDeviceService.findOne(id, [
      'messageTemplates',
      'room',
    ]);
    return plainToInstance(DetailDeviceResponseDto, result);
  }
  @Patch('/:id/active')
  async updateActive(
    @Param('id') id: string,
    @Body('active') active: boolean,
  ): Promise<void> {
    await this.databaseDeviceService.updateActive(id, active);
  }

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

  @Get('/')
  async getDevices() {
    const result = await this.databaseDeviceService.findAll();
    return plainToInstance(ListDeviceResponseDto, { list: result });
  }

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
