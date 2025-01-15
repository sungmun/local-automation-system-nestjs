import { RoomWithDeviceDto } from './room-with-device.dto';
import { ResponseDevice } from '../../hejhome-api/hejhome-api.interface';

describe('RoomWithDeviceDto', () => {
  describe('생성자 테스트', () => {
    it('ResponseDevice와 roomId로 올바르게 초기화되어야 합니다', () => {
      const responseDevice: ResponseDevice = {
        id: 'device1',
        name: '거실 에어컨',
        deviceType: 'AC',
        modelName: 'Samsung AC',
        familyId: 'family1',
        online: true,
        category: '',
        hasSubDevices: false,
      };

      const roomId = 1;
      const dto = new RoomWithDeviceDto(responseDevice, roomId);

      expect(dto.id).toBe('device1');
      expect(dto.name).toBe('거실 에어컨');
      expect(dto.deviceType).toBe('AC');
      expect(dto.modelName).toBe('Samsung AC');
      expect(dto.familyId).toBe('family1');
      expect(dto.roomId).toBe(1);
      expect(dto.online).toBe(true);
      expect(dto.platform).toBe('hejhome');
    });

    it('platform은 기본값으로 hejhome이 설정되어야 합니다', () => {
      const responseDevice: ResponseDevice = {
        id: 'device1',
        name: '거실 에어컨',
        deviceType: 'AC',
        online: true,
        category: '',
        hasSubDevices: false,
        modelName: '',
        familyId: '',
      };

      const dto = new RoomWithDeviceDto(responseDevice, 1);
      expect(dto.platform).toBe('hejhome');
    });

    it('DeviceDto를 상속받아야 합니다', () => {
      const responseDevice: ResponseDevice = {
        id: 'device1',
        name: '거실 에어컨',
        deviceType: 'AC',
        online: true,
        category: '',
        hasSubDevices: false,
        modelName: '',
        familyId: '',
      };

      const dto = new RoomWithDeviceDto(responseDevice, 1);

      // DeviceDto의 기본 속성들 검증
      expect(dto).toHaveProperty('id');
      expect(dto).toHaveProperty('name');
      expect(dto).toHaveProperty('deviceType');
      expect(dto).toHaveProperty('platform');
    });
  });
});
