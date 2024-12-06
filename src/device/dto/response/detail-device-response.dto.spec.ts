import 'reflect-metadata';
import { DetailDeviceResponseDto } from './detail-device-response.dto';
import { plainToInstance } from 'class-transformer';

describe('DetailDeviceResponseDto', () => {
  describe('생성자 테스트', () => {
    it('모든 필수 속성이 정상적으로 설정되어야 합니다', () => {
      const messageTemplate = {
        id: 'template1',
        name: 'Template1',
        body: 'Body1',
        title: 'Title1',
        type: 'changed',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        devices: [],
      };

      const room = {
        id: 1,
        name: '거실',
        temperature: 22,
        sensorId: 'sensor123',
        active: true,
        acStartTemperature: 2750,
        acStopTemperature: 2850,
        heatingStartTemperature: 1800,
        heatingStopTemperature: 2000,
        devices: [],
      };

      const plain = {
        id: 'device1',
        name: '거실 에어컨',
        deviceType: 'AC',
        modelName: 'Samsung AC',
        familyId: 'family1',
        roomId: room.id,
        room: room,
        category: 'AIR_CONDITIONER',
        online: true,
        hasSubDevices: false,
        active: true,
        platform: 'samsung',
        state: JSON.stringify({ power: 'on', temperature: 24 }),
        updateStateAt: '2024-01-01T00:00:00.000Z',
        activeMessageTemplate: false,
        messageTemplates: [messageTemplate],
      };

      const dto = plainToInstance(DetailDeviceResponseDto, plain);

      expect(dto.id).toBe('device1');
      expect(dto.name).toBe('거실 에어컨');
      expect(dto.deviceType).toBe('AC');
      expect(dto.modelName).toBe('Samsung AC');
      expect(dto.familyId).toBe('family1');
      expect(dto.roomId).toBe(room.id);
      expect(dto.room).toEqual(room);
      expect(dto.category).toBe('AIR_CONDITIONER');
      expect(dto.online).toBe(true);
      expect(dto.hasSubDevices).toBe(false);
      expect(dto.active).toBe(true);
      expect(dto.platform).toBe('samsung');
      expect(dto.state).toEqual({ power: 'on', temperature: 24 });
      expect(dto.updateStateAt).toBe('2024-01-01T00:00:00.000Z');
      expect(dto.activeMessageTemplate).toBe(false);
      expect(dto.messageTemplates).toEqual([messageTemplate]);
    });

    it('선택적 필드가 누락되어도 변환되어야 합니다', () => {
      const plain = {
        id: 'device1',
        name: '거실 에어컨',
        deviceType: 'AC',
        platform: 'samsung',
        state: JSON.stringify({ power: 'on' }),
      };

      const dto = plainToInstance(DetailDeviceResponseDto, plain);

      expect(dto.id).toBe('device1');
      expect(dto.name).toBe('거실 에어컨');
      expect(dto.deviceType).toBe('AC');
      expect(dto.platform).toBe('samsung');
      expect(dto.state).toEqual({ power: 'on' });
      expect(dto.modelName).toBeUndefined();
      expect(dto.familyId).toBeUndefined();
      expect(dto.room).toBeUndefined();
      expect(dto.category).toBeUndefined();
      expect(dto.messageTemplates).toBeUndefined();
    });

    it('state가 문자열로 주어져도 객체로 변환되어야 합니다', () => {
      const plain = {
        id: 'device1',
        name: '거실 에어컨',
        deviceType: 'AC',
        platform: 'samsung',
        state: JSON.stringify({ power: 'on', brightness: 80 }),
      };

      const dto = plainToInstance(DetailDeviceResponseDto, plain);
      expect(dto.state).toEqual({ power: 'on', brightness: 80 });
    });

    it('state가 이미 객체인 경우 그대로 유지되어야 합니다', () => {
      const plain = {
        id: 'device1',
        name: '거실 에어컨',
        deviceType: 'AC',
        platform: 'samsung',
        state: { power: 'on', brightness: 80 },
      };

      const dto = plainToInstance(DetailDeviceResponseDto, plain);
      expect(dto.state).toEqual({ power: 'on', brightness: 80 });
    });

    it('boolean 필드들이 올바르게 변환되어야 합니다', () => {
      const plain = {
        id: 'device1',
        name: '거실 에어컨',
        deviceType: 'AC',
        platform: 'samsung',
        online: true,
        hasSubDevices: true,
        active: true,
        activeMessageTemplate: true,
        state: { power: 'on' },
      };

      const dto = plainToInstance(DetailDeviceResponseDto, plain);

      expect(dto.online).toBe(true);
      expect(dto.hasSubDevices).toBe(true);
      expect(dto.active).toBe(true);
      expect(dto.activeMessageTemplate).toBe(true);
    });
  });
});
