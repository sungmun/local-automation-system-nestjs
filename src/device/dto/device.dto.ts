import { Exclude, Expose } from 'class-transformer';

export class DeviceDto {
  id: string;

  name: string;

  deviceType: string;

  modelName: string;

  familyId: string;

  roomId?: number;

  category: string;

  online: boolean;

  hasSubDevices: boolean;

  active?: boolean = true;

  platform?: string = 'hejhome';

  updateStateAt?: string;

  activeMessageTemplate?: boolean = false;

  @Expose({ name: 'state' })
  @Exclude()
  _state?: string;

  get state() {
    return this._state || '';
  }

  set state(state: string) {
    this._state = state;
  }
}
