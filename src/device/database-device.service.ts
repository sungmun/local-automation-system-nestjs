import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: string): Promise<Device> {
    const device = await this.deviceRepository.findOneBy({ id });
    if (device === null) {
      throw new NotFoundException('device not found error', id);
    }
    return device;
  }

  async updateState(id: string, state: object): Promise<void> {
    await this.deviceRepository.update(id, { state: JSON.stringify(state) });
  }
}
