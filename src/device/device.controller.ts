import { Body, Controller, Get, Logger, Param, Patch } from '@nestjs/common';
import { DataBaseDeviceService } from './database-device.service';
import { OnEvent } from '@nestjs/event-emitter';
import { ResponseDeviceState } from '../hejhome-api/hejhome-api.interface';

@Controller('/devices')
export class DeviceController {
  constructor(private readonly databaseDeviceService: DataBaseDeviceService) {}

  @OnEvent('finish.**', { async: true })
  async FinishEvent(state: ResponseDeviceState) {
    await this.databaseDeviceService.updateState(state.id, state.deviceState);
  }

  @Patch('/:id/active')
  async updateActive(@Param('id') id: string, @Body() active: boolean) {
    await this.databaseDeviceService.updateActive(id, active);
  }

  @Get('/')
  async getDevices() {
    return this.databaseDeviceService.findAll();
  }
}
