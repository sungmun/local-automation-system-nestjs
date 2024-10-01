import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './entities/device.entity';

@Injectable()
export class DataBaseDeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  async bulkInsert(devices: Device[]): Promise<void> {
    await this.deviceRepository.save(devices);
  }

  async findAll(): Promise<Device[]> {
    return this.deviceRepository.find();
  }
}
