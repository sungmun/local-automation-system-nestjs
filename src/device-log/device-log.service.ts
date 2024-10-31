import { Injectable } from '@nestjs/common';
import { CreateDeviceLogDto } from './dto/create-device-log.dto';
import { Repository } from 'typeorm';
import { DeviceLog } from './entities/device-log.entity';
import { ResponseDeviceState } from '../hejhome-api/hejhome-api.interface';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DeviceLogService {
  constructor(
    @InjectRepository(DeviceLog)
    private readonly deviceLogRepository: Repository<DeviceLog>,
  ) {}
  async log(message: string, createDeviceLogDto: CreateDeviceLogDto) {
    const deviceLog = this.deviceLogRepository.create({
      deviceId: createDeviceLogDto.deviceId,
      logMessage: `${createDeviceLogDto.type} - ${message}`,
      type: createDeviceLogDto.type,
    });
    await this.deviceLogRepository.save(deviceLog);
  }

  async findLogs() {
    return this.deviceLogRepository.find({ order: { createdAt: 'DESC' } });
  }

  async autoChangeLog(state: ResponseDeviceState) {
    const { id, deviceState } = state;
    await this.log(
      `[${state.deviceType}](${id}) / ${JSON.stringify(deviceState)}`,
      {
        deviceId: id,
        type: 'AUTO_CHANGE',
      },
    );
  }
}
