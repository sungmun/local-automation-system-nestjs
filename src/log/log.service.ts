import { Injectable } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { Repository } from 'typeorm';
import { Log } from './entities/log.entity';
import { ResponseDeviceState } from '../hejhome-api/hejhome-api.interface';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}
  async log(message: string, createLogDto: CreateLogDto) {
    await this.logRepository.save({
      deviceId: createLogDto.deviceId,
      logMessage: `${createLogDto.type} - ${message}`,
      type: createLogDto.type,
    });
  }

  async findLogs() {
    return this.logRepository.find({ order: { createdAt: 'DESC' } });
  }

  async autoDeviceChangeLog(state: ResponseDeviceState) {
    const { id, deviceState } = state;
    await this.log(
      `[${state.deviceType}](${id}) / ${JSON.stringify(deviceState)}`,
      {
        deviceId: id,
        type: 'DEVICE_AUTO_CHANGE',
      },
    );
  }
}
