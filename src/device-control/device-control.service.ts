import { Injectable, Logger } from '@nestjs/common';
import { IrAirconditionerControl } from 'src/hejhome-api/hejhome-api.interface';
import { HejhomeApiService } from 'src/hejhome-api/hejhome-api.service';

@Injectable()
export class DeviceControlService {
  private readonly logger = new Logger(DeviceControlService.name);

  constructor(private readonly hejhomeApiService: HejhomeApiService) {}

  async airconditionerControl(id: string, state: IrAirconditionerControl) {
    await this.hejhomeApiService.setDeviceControl(id, { requirments: state });
  }
}
