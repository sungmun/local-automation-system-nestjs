import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { DataBaseDeviceService } from './database-device.service';

@Controller('/devices')
export class DeviceController {
  constructor(private readonly databaseDeviceService: DataBaseDeviceService) {}

  @Get('/:id')
  async detailDevice(@Param('id') id: string) {
    return this.databaseDeviceService.findOne(id, ['messageTemplates', 'room']);
  }
  @Patch('/:id/active')
  async updateActive(@Param('id') id: string, @Body('active') active: boolean) {
    await this.databaseDeviceService.updateActive(id, active);
  }

  @Patch('/:id/active-message-template')
  async updateActiveMessageTemplate(
    @Param('id') id: string,
    @Body('activeMessageTemplate') activeMessageTemplate: boolean,
  ) {
    await this.databaseDeviceService.updateActiveMessageTemplate(
      id,
      activeMessageTemplate,
    );
  }

  @Get('/')
  async getDevices() {
    return this.databaseDeviceService.findAll();
  }

  @Post('/:id/message-template')
  async createMessageTemplate(
    @Param('id') id: string,
    @Body('templateId') templateId: string,
  ) {
    return this.databaseDeviceService.connectMessageTemplate(id, templateId);
  }
}
