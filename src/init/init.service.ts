import {
  Injectable,
  Logger,
  LoggerService,
  OnModuleInit,
} from '@nestjs/common';
import _ from 'lodash';
import { AuthService } from '../auth/auth.service';
import { DeviceStatusService } from '../device-status/device-status.service';
import { CloudDeviceService } from 'src/device/cloud-device.service';
import { DataBaseDeviceService } from 'src/device/database-device.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TaskService } from 'src/task/task.service';

@Injectable()
export class InitService implements OnModuleInit {
  private readonly logger = new Logger(InitService.name);
  constructor(
    private readonly authService: AuthService,
    private readonly cloudDeviceService: CloudDeviceService,
    private readonly databaseDeviceService: DataBaseDeviceService,
    private readonly taskService: TaskService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private async initDevice() {
    const uniqueDevices = await this.cloudDeviceService.getUniqueDevices();
    await this.databaseDeviceService.bulkInsert(uniqueDevices);
    return uniqueDevices;
  }

  async onModuleInit() {
    try {
      this.logger.log('onModuleInit start');
      await this.authService.setRefreshToken();
      await this.initDevice();
      this.logger.log('onModuleInit success');
      this.taskService.hejhomeAPICheck();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
