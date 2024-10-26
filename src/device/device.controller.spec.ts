import { Test, TestingModule } from '@nestjs/testing';
import { DeviceController } from './device.controller';
import { DataBaseDeviceService } from './database-device.service';
import { ResponseDeviceState } from '../hejhome-api/hejhome-api.interface';
import { NotFoundException } from '@nestjs/common';
import { Device } from './entities/device.entity';

describe('DeviceController', () => {
  let controller: DeviceController;
  let service: DataBaseDeviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceController],
      providers: [
        {
          provide: DataBaseDeviceService,
          useValue: {
            findOne: jest.fn(),
            findAll: jest.fn(),
            updateActive: jest.fn(),
            updateActiveMessageTemplate: jest.fn(),
            connectMessageTemplate: jest.fn(),
            changedDeviceSendMessage: jest.fn(),
            updateState: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DeviceController>(DeviceController);
    service = module.get<DataBaseDeviceService>(DataBaseDeviceService);
  });

  describe('detailDevice', () => {
    it('존재하는 장치의 세부 정보를 반환해야 한다', async () => {
      const room = {
        id: 1,
        name: 'Living Room',
        temperature: 22,
        sensorId: 'sensor123',
        active: true,
        acStartTemperature: 2750,
        acStopTemperature: 2850,
        heatingStartTemperature: 1800,
        heatingStopTemperature: 2000,
        devices: [],
      };

      const messageTemplate = {
        id: 'template1',
        name: 'Template1',
        body: 'Body1',
        title: 'Title1',
        type: 'changed',
        createdAt: new Date(),
        updatedAt: new Date(),
        devices: [],
      };

      const device: Device = {
        id: '1',
        name: 'Device1',
        deviceType: 'Type1',
        modelName: 'Model1',
        familyId: 'Family1',
        roomId: room.id,
        room: room,
        category: 'Category1',
        online: true,
        hasSubDevices: false,
        active: true,
        platform: 'Platform1',
        state: JSON.stringify({ power: 'on' }),
        updateStateAt: new Date().toISOString(),
        activeMessageTemplate: false,
        messageTemplates: [messageTemplate],
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(device);

      const result = await controller.detailDevice('1');
      expect(result).toEqual(device);
    });

    it('장치를 찾지 못하면 예외를 던져야 한다', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.detailDevice('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getDevices', () => {
    it('모든 장치를 반환해야 한다', async () => {
      const devices: Device[] = [
        {
          id: '1',
          name: 'Device1',
          deviceType: 'Type1',
          modelName: 'Model1',
          familyId: 'Family1',
          roomId: 1,
          room: undefined,
          category: 'Category1',
          online: true,
          hasSubDevices: false,
          active: true,
          platform: 'Platform1',
          state: JSON.stringify({ power: 'on' }),
          updateStateAt: new Date().toISOString(),
          activeMessageTemplate: false,
          messageTemplates: [],
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(devices);

      const result = await controller.getDevices();
      expect(result).toEqual(devices);
    });
  });

  describe('updateActive', () => {
    it('장치의 활성 상태를 업데이트해야 한다', async () => {
      await controller.updateActive('1', true);
      expect(service.updateActive).toHaveBeenCalledWith('1', true);
    });
  });

  describe('updateActiveMessageTemplate', () => {
    it('장치의 활성 메시지 템플릿 상태를 업데이트해야 한다', async () => {
      await controller.updateActiveMessageTemplate('1', true);
      expect(service.updateActiveMessageTemplate).toHaveBeenCalledWith(
        '1',
        true,
      );
    });
  });

  describe('createMessageTemplate', () => {
    it('장치에 메시지 템플릿을 연결해야 한다', async () => {
      await controller.createMessageTemplate('1', 'template1');
      expect(service.connectMessageTemplate).toHaveBeenCalledWith(
        '1',
        'template1',
      );
    });
  });

  describe('finishEvent', () => {
    it('장치 상태를 업데이트해야 한다', async () => {
      const state: ResponseDeviceState = {
        id: '1',
        deviceType: 'Type1',
        deviceState: { power: 'on' },
      };
      await controller.finishEvent(state);
      expect(service.updateState).toHaveBeenCalledWith('1', state.deviceState);
    });
  });

  describe('changedDeviceSendMessage', () => {
    it('장치 상태가 변경되었을 때 메시지를 전송해야 한다', async () => {
      const state: ResponseDeviceState = {
        id: '1',
        deviceType: 'Type1',
        deviceState: { power: 'on' },
      };
      await controller.changedDeviceSendMessage(state);
      expect(service.changedDeviceSendMessage).toHaveBeenCalledWith(state);
    });
  });
});
