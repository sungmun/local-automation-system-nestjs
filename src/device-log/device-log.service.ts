import { Injectable } from '@nestjs/common';
import { CreateDeviceLogDto } from './dto/create-device-log.dto';
import { UpdateDeviceLogDto } from './dto/update-device-log.dto';

@Injectable()
export class DeviceLogService {
  create(createDeviceLogDto: CreateDeviceLogDto) {
    return 'This action adds a new deviceLog';
  }

  findAll() {
    return `This action returns all deviceLog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deviceLog`;
  }

  update(id: number, updateDeviceLogDto: UpdateDeviceLogDto) {
    return `This action updates a #${id} deviceLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} deviceLog`;
  }
}
