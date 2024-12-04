import 'reflect-metadata';
import { ConnectDeviceToMessageTemplateResponseDto } from './connect-device-to-message-template-response.dto';
import { plainToInstance } from 'class-transformer';

describe('ConnectDeviceToMessageTemplateResponseDto', () => {
  it('DTO가 올바르게 변환되어야 합니다', () => {
    const messageTemplate = {
      id: 'template1',
      name: 'Template1',
      body: 'Body1',
      title: 'Title1',
      type: 'changed',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    };

    const plain = {
      id: 'device1',
      name: '거실 에어컨',
      platform: 'samsung',
      roomId: 1,
      deviceType: 'AC',
      state: { power: 'on' },
      messageTemplates: [messageTemplate],
    };

    const dto = plainToInstance(
      ConnectDeviceToMessageTemplateResponseDto,
      plain,
    );

    expect(dto.id).toBe('device1');
    expect(dto.name).toBe('거실 에어컨');
    expect(dto.platform).toBe('samsung');
    expect(dto.roomId).toBe(1);
    expect(dto.deviceType).toBe('AC');
    expect(dto.state).toEqual({ power: 'on' });
    expect(dto.messageTemplates).toHaveLength(1);
    expect(dto.messageTemplates[0]).toEqual(messageTemplate);
  });
});
