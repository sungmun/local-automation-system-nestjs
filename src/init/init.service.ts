import {
  Injectable,
  Logger,
  LoggerService,
  OnModuleInit,
} from '@nestjs/common';
import _ from 'lodash';
import { AuthService } from '../auth/auth.service';
import { DeviceStatusService } from '../device-status/device-status.service';

@Injectable()
export class InitService implements OnModuleInit {
  private readonly logger = new Logger(InitService.name);
  constructor(
    private readonly authService: AuthService,
    private readonly deviceStatusService: DeviceStatusService,
  ) {}
  async initDeviceStatus() {
    const uniqueDevices = await this.deviceStatusService.getUniqueDevices();

    return uniqueDevices;
  }
  async onModuleInit() {
    try {
      this.logger.log('onModuleInit start');
      await this.authService.refreshToken();
      await this.initDeviceStatus();
      this.logger.log('onModuleInit success');
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
