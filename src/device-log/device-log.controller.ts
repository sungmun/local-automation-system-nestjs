import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DeviceLogService } from './device-log.service';
import { CreateDeviceLogDto } from './dto/create-device-log.dto';
import { UpdateDeviceLogDto } from './dto/update-device-log.dto';

@Controller()
export class DeviceLogController {
  constructor(private readonly deviceLogService: DeviceLogService) {}

  @MessagePattern('createDeviceLog')
  create(@Payload() createDeviceLogDto: CreateDeviceLogDto) {
    return this.deviceLogService.create(createDeviceLogDto);
  }

  @MessagePattern('findAllDeviceLog')
  findAll() {
    return this.deviceLogService.findAll();
  }

  @MessagePattern('findOneDeviceLog')
  findOne(@Payload() id: number) {
    return this.deviceLogService.findOne(id);
  }

  @MessagePattern('updateDeviceLog')
  update(@Payload() updateDeviceLogDto: UpdateDeviceLogDto) {
    return this.deviceLogService.update(updateDeviceLogDto.id, updateDeviceLogDto);
  }

  @MessagePattern('removeDeviceLog')
  remove(@Payload() id: number) {
    return this.deviceLogService.remove(id);
  }
}
