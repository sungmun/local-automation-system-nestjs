import { ResponseDevice } from '../../hejhome-api/hejhome-api.interface';
import { DeviceDto } from './device.dto';

export class RoomWithDeviceDto extends DeviceDto {
  roomId?: number;
  online: boolean;

  platform: string = 'hejhome';

  constructor(device: ResponseDevice, roomId: number) {
    super();
    this.id = device.id;
    this.name = device.name;
    this.deviceType = device.deviceType;
    this.modelName = device.modelName;
    this.familyId = device.familyId;
    this.category = device.category;
    this.hasSubDevices = device.hasSubDevices;
    this.online = device.online;
    this.roomId = roomId;
  }
}
