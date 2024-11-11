import { Test, TestingModule } from '@nestjs/testing';
import { DataBaseDeviceService } from './database-device.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { MessageTemplateService } from '../message-template/message-template.service';
import { PushMessagingService } from '../push-messaging/push-messaging.service';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ResponseDeviceState } from 'src/hejhome-api/hejhome-api.interface';

describe('DataBaseDeviceService', () => {
  let service: DataBaseDeviceService;
  let deviceRepository: Repository<Device>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataBaseDeviceService,
        {
          provide: getRepositoryToken(Device),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([]),
            }),
          },
        },
        {
          provide: MessageTemplateService,
          useValue: {
            findOne: jest.fn(),
            makeTemplateMessage: jest.fn(),
          },
        },
        {
          provide: PushMessagingService,
          useValue: {
            sendMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DataBaseDeviceService>(DataBaseDeviceService);
    deviceRepository = module.get<Repository<Device>>(
      getRepositoryToken(Device),
    );
  });

  describe('bulkInsert', () => {
    it('장치를 대량으로 삽입해야 한다', async () => {
      const devices: Device[] = [
        {
          id: 'device1',
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
      await service.bulkInsert(devices);
      expect(deviceRepository.save).toHaveBeenCalledWith(devices);
    });
  });

  describe('findAll', () => {
    it('모든 장치를 반환해야 한다', async () => {
      const devices: Device[] = [
        {
          id: 'device1',
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
      jest.spyOn(deviceRepository, 'find').mockResolvedValue(devices);
      const result = await service.findAll();
      expect(result).toEqual(devices);
    });
  });

  describe('findInIds', () => {
    it('id 배열에 해당하는 장치를 반환해야 한다', async () => {
      const devices: Device[] = [
        {
          id: 'device1',
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
      jest.spyOn(deviceRepository, 'find').mockResolvedValue(devices);
      const result = await service.findInIds(['device1']);
      expect(result).toEqual(devices);
    });
  });

  describe('findOne', () => {
    it('존재하는 장치를 반환해야 한다', async () => {
      const device: Device = {
        id: 'device1',
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
      };
      jest.spyOn(deviceRepository, 'findOne').mockResolvedValue(device);
      const result = await service.findOne('device1');
      expect(result).toEqual(device);
    });

    it('장치를 찾지 못하면 예외를 던져야 한다', async () => {
      jest.spyOn(deviceRepository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne('device1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateActive', () => {
    it('장치의 활성 상태를 업데이트해야 한다', async () => {
      await service.updateActive('device1', true);
      expect(deviceRepository.update).toHaveBeenCalledWith('device1', {
        active: true,
      });
    });
  });

  describe('updateActiveMessageTemplate', () => {
    it('장치의 활성 메시지 템플릿 상태를 업데이트해야 한다', async () => {
      await service.updateActiveMessageTemplate('device1', true);
      expect(deviceRepository.update).toHaveBeenCalledWith('device1', {
        activeMessageTemplate: true,
      });
    });
  });

  describe('updateState', () => {
    it('장치의 상태를 업데이트해야 한다', async () => {
      const state = { power: 'on' };
      await service.updateState('device1', state);
      expect(deviceRepository.update).toHaveBeenCalledWith('device1', {
        state: JSON.stringify(state),
      });
    });
  });

  describe('getDevicesByRoomOrUnassignedAndDeviceType', () => {
    it('방 ID 또는 할당되지 않은 장치와 장치 유형에 따라 장치를 반환해야 한다', async () => {
      const devices: Device[] = [
        {
          id: 'device1',
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
      jest
        .spyOn(deviceRepository.createQueryBuilder(), 'getMany')
        .mockResolvedValue(devices);
      const result = await service.getDevicesByRoomOrUnassignedAndDeviceType(
        1,
        'Type1',
      );
      expect(result).toEqual(devices);
    });
  });

  describe('connectMessageTemplate', () => {
    it('장치에 메시지 템플릿을 연결해야 한다', async () => {
      const template = {
        id: 'template1',
        name: 'Template1',
        body: 'Body1',
        title: 'Title1',
        type: 'Type1',
        createdAt: new Date(),
        updatedAt: new Date(),
        devices: [],
      };
      const device: Device = {
        id: 'device1',
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
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(device);
      jest
        .spyOn(service['messageTemplateService'], 'findOne')
        .mockResolvedValue(template);

      await service.connectMessageTemplate('device1', 'template1');
      expect(deviceRepository.save).toHaveBeenCalledWith({
        ...device,
        messageTemplates: [template],
      });
    });
  });

  describe('changedDeviceSendMessage', () => {
    const state = {
      id: 'device1',
      deviceType: 'deviceType',
      deviceState: { power: 'on' },
    };
    let device: Device;
    beforeEach(() => {
      device = {
        id: 'device1',
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
        state: JSON.stringify(state.deviceState),
        updateStateAt: new Date().toISOString(),
        activeMessageTemplate: true,
        messageTemplates: [
          {
            id: 'template1',
            name: 'Template1',
            body: 'Body1',
            title: 'Title1',
            type: 'changed',
            createdAt: new Date(),
            updatedAt: new Date(),
            devices: [],
          },
        ],
      };
    });

    it('장치 상태가 변경되었을 때 장치의 메세지 템플릿이 활성화가 안되어있으면 중단한다.', async () => {
      device.activeMessageTemplate = false;
      jest.spyOn(service, 'findOne').mockResolvedValue(device);
      await service.changedDeviceSendMessage(state as ResponseDeviceState);
      expect(
        service['messageTemplateService'].makeTemplateMessage,
      ).not.toHaveBeenCalled();
      expect(
        service['pushMessagingService'].sendMessage,
      ).not.toHaveBeenCalled();
    });

    it('장치 상태가 변경되었을 때 메시지를 전송해야 한다', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(device);
      jest
        .spyOn(service['messageTemplateService'], 'makeTemplateMessage')
        .mockReturnValue('Message');

      await service.changedDeviceSendMessage(state as ResponseDeviceState);
      expect(service['pushMessagingService'].sendMessage).toHaveBeenCalledWith(
        'Message',
        'Message',
      );
    });
  });
});
