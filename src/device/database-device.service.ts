import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './entities/device.entity';
import { MessageTemplateService } from '../message-template/message-template.service';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

@Injectable()
export class DataBaseDeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    private readonly messageTemplateService: MessageTemplateService,
  ) {}

  async bulkInsert(
    devices: PartialBy<
      Device,
      'active' | 'platform' | 'activeMessageTemplate'
    >[],
  ): Promise<void> {
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

  async updateActive(id: string, active: boolean): Promise<void> {
    await this.deviceRepository.update(id, { active });
  }

  async updateState(id: string, state: object): Promise<void> {
    await this.deviceRepository.update(id, { state: JSON.stringify(state) });
  }

  async getDevicesByRoomOrUnassignedAndDeviceType(
    roomId: number,
    deviceType: string,
  ): Promise<Device[]> {
    return this.deviceRepository
      .createQueryBuilder('device')
      .where('device.roomId = :roomId OR device.roomId IS NULL', { roomId })
      .andWhere('device.deviceType = :deviceType', { deviceType })
      .getMany();
  }

  async connectMessageTemplate(deviceId: string, messageTemplateId: string) {
    const template =
      await this.messageTemplateService.findOne(messageTemplateId);
    const device = await this.findOne(deviceId);

    device.messageTemplates.push(template);
    await this.deviceRepository.save(device);
  }
}
