import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DataBaseDeviceService } from '../device/database-device.service';
import { DeviceStateService } from '../device-state/device-state.service';
import { Device } from '../device/entities/device.entity';
import type { ResponseDeviceState } from '../hejhome-api/hejhome-api.interface';

type RequireDevice = Pick<Device, 'id' | 'deviceType'>;

@Injectable()
export class DeviceCheckService {
  private readonly logger = new Logger(DeviceCheckService.name);

  constructor(
    private readonly databaseDeviceService: DataBaseDeviceService,
    private readonly deviceStateService: DeviceStateService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async checkDevices() {
    const devices = await this.databaseDeviceService.findAll();

    for (const device of devices) {
      await this.processDevice(device);
    }
  }

  private async processDevice(device: RequireDevice) {
    if (device.deviceType === 'IrDiy') {
      this.logger.debug(`skip set.${device.deviceType}.${device.id}`);
      return;
    }
    const state = await this.getDeviceState(device);
    if (!state) return;

    this.emitDeviceState(device, state);
  }

  private async getDeviceState(device: RequireDevice) {
    try {
      return await this.deviceStateService.getDeviceState(
        device.id,
        device.deviceType,
      );
    } catch (error) {
      this.logger.error(
        `장치 상태 조회 실패 [${device.id}] - ${device.deviceType}: ${error.message}`,
      );
      return null;
    }
  }

  private emitDeviceState(device: RequireDevice, state: ResponseDeviceState) {
    const eventName = `set.${device.deviceType}.${device.id}`;
    this.logger.debug(`장치 상태 이벤트 발생: ${eventName}`);
    this.eventEmitter.emit(eventName, state);
  }
}
