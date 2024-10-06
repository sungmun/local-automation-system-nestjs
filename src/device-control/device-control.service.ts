import { Injectable, Logger } from '@nestjs/common';
import { IrAirconditionerControl } from '../hejhome-api/hejhome-api.interface';
import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';

@Injectable()
export class DeviceControlService {
  private readonly logger = new Logger(DeviceControlService.name);

  constructor(private readonly hejhomeApiService: HejhomeApiService) {}

  async airconditionerControl(id: string, state: IrAirconditionerControl) {
    await this.hejhomeApiService.setDeviceControl(id, { requirments: state });
  }

  async airconditionerOn(id: string) {
    await this.airconditionerControl(id, {
      fanSpeed: 3,
      power: '켜짐',
      mode: 0,
      temperature: 18,
    });
  }

  async airconditionerOff(id: string) {
    await this.airconditionerControl(id, {
      fanSpeed: 3,
      power: '꺼짐',
      mode: 0,
      temperature: 18,
    });
  }
}
