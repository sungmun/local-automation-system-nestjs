export class CreateHejhomeDeviceDto {
  id: string;

  name: string;

  deviceType: string;

  modelName: string;

  familyId: string;

  roomId?: number;

  category: string;

  online: boolean;

  hasSubDevices: boolean;

  active: boolean;

  platform: string = 'hejhome';

  state?: string;

  updateStateAt?: string;

  activeMessageTemplate: boolean;
}
