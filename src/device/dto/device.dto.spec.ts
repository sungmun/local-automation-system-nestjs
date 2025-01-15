import { DeviceDto } from './device.dto';
import { plainToInstance } from 'class-transformer';

describe('DeviceDto', () => {
  describe('생성자 테스트', () => {
    it('모든 필수 속성이 정상적으로 설정되어야 합니다', () => {
      const plain = {
        id: 'device1',
        name: '거실 에어컨',
        deviceType: 'AC',
        modelName: 'Samsung AC',
        familyId: 'family1',
        roomId: 1,
        category: 'AIR_CONDITIONER',
        online: true,
        hasSubDevices: false,
        active: true,
        platform: 'hejhome',
        updateStateAt: '2024-01-01T00:00:00.000Z',
        activeMessageTemplate: false,
        state: '{"power":"on","temperature":24}',
      };

      const dto = plainToInstance(DeviceDto, plain);

      expect(dto.id).toBe('device1');
      expect(dto.name).toBe('거실 에어컨');
      expect(dto.deviceType).toBe('AC');
      expect(dto.modelName).toBe('Samsung AC');
      expect(dto.familyId).toBe('family1');
      expect(dto.roomId).toBe(1);
      expect(dto.category).toBe('AIR_CONDITIONER');
      expect(dto.online).toBe(true);
      expect(dto.hasSubDevices).toBe(false);
      expect(dto.active).toBe(true);
      expect(dto.platform).toBe('hejhome');
      expect(dto.updateStateAt).toBe('2024-01-01T00:00:00.000Z');
      expect(dto.activeMessageTemplate).toBe(false);
      expect(dto.state).toBe('{"power":"on","temperature":24}');
    });

    it('선택적 필드들이 기본값으로 설정되어야 합니다', () => {
      const plain = {
        id: 'device1',
        name: '거실 에어컨',
        deviceType: 'AC',
        modelName: 'Samsung AC',
        familyId: 'family1',
        category: 'AIR_CONDITIONER',
        online: true,
        hasSubDevices: false,
      };

      const dto = plainToInstance(DeviceDto, plain);

      expect(dto.active).toBe(true);
      expect(dto.platform).toBe('hejhome');
      expect(dto.activeMessageTemplate).toBe(false);
      expect(dto.roomId).toBeUndefined();
      expect(dto.updateStateAt).toBeUndefined();
    });

    describe('state 프로퍼티 테스트', () => {
      it('state가 문자열로 설정되어야 합니다', () => {
        const dto = plainToInstance(DeviceDto, {
          id: 'device1',
          state: '{"power":"on"}',
        });

        expect(dto.state).toBe('{"power":"on"}');
      });

      it('state가 없을 경우 빈 문자열로 설정되어야 합니다', () => {
        const dto = plainToInstance(DeviceDto, {
          id: 'device1',
        });

        expect(dto.state).toBe('');
      });

      it('state setter가 정상적으로 동작해야 합니다', () => {
        const dto = plainToInstance(DeviceDto, {
          id: 'device1',
        });

        dto.state = '{"power":"off"}';
        expect(dto.state).toBe('{"power":"off"}');
      });
    });
  });
});
