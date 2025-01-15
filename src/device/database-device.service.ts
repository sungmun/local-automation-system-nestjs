import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Device } from './entities/device.entity';
import { MessageTemplateService } from '../message-template/message-template.service';
import { ResponseDeviceState } from '../hejhome-api/hejhome-api.interface';
import { PushMessagingService } from '../push-messaging/push-messaging.service';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

@Injectable()
export class DataBaseDeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    private readonly messageTemplateService: MessageTemplateService,
    private readonly pushMessagingService: PushMessagingService,
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

  async findOne(id: string, relations: string[] = []): Promise<Device> {
    const device = await this.deviceRepository.findOne({
      where: { id },
      relations,
    });
    if (device === null) {
      throw new NotFoundException('device not found error', id);
    }
    return device;
  }

  async findInIds(ids: string[]): Promise<Device[]> {
    return this.deviceRepository.find({
      where: { id: In(ids) },
    });
  }

  async updateActive(id: string, active: boolean): Promise<void> {
    await this.deviceRepository.update(id, { active });
  }

  async updateActiveMessageTemplate(
    id: string,
    activeMessageTemplate: boolean,
  ): Promise<void> {
    await this.deviceRepository.update(id, { activeMessageTemplate });
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
    const device = await this.findOne(deviceId, ['messageTemplates']);
    device.messageTemplates = [...device.messageTemplates, template];

    await this.deviceRepository.save(device);
  }

  async changedDeviceSendMessage(state: ResponseDeviceState) {
    const device = await this.findOne(state.id, ['messageTemplates']);
    if (device.activeMessageTemplate === false) return;
    const messageTemplates = device.messageTemplates.filter(
      (template) => template.type === 'changed',
    );

    const messages = messageTemplates.map((template) => ({
      body: this.messageTemplateService.makeTemplateMessage(template.body, {
        name: device.name,
        afterPower: state.deviceState['power'],
        delayTime: Math.floor(
          (Date.now() - Date.parse(device.updateStateAt)) / 1000 / 60,
        ),
      }),
      title: this.messageTemplateService.makeTemplateMessage(template.title, {
        name: device.name,
        afterPower: state.deviceState['power'],
      }),
    }));

    await Promise.all(
      messages.map(async (message) => {
        await this.pushMessagingService.sendMessage(
          message.title,
          message.body,
        );
      }),
    );
  }
}
