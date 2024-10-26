import { Test, TestingModule } from '@nestjs/testing';
import { DeviceControlService } from './device-control.service';
import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';
import { IrAirconditionerControl } from '../hejhome-api/hejhome-api.interface';

describe('DeviceControlService', () => {
  let service: DeviceControlService;
  let hejhomeApiService: HejhomeApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceControlService,
        {
          provide: HejhomeApiService,
          useValue: {
            setDeviceControl: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DeviceControlService>(DeviceControlService);
    hejhomeApiService = module.get<HejhomeApiService>(HejhomeApiService);
  });

  describe('airconditionerControl', () => {
    it('에어컨 제어 요청이 올바르게 호출되어야 한다', async () => {
      const id = 'device1';
      const state: IrAirconditionerControl = {
        power: '켜짐',
        temperature: 24,
        fanSpeed: 2,
        mode: 1,
      };

      await service.airconditionerControl(id, state);

      expect(hejhomeApiService.setDeviceControl).toHaveBeenCalledWith(id, {
        requirments: state,
      });
    });
  });

  describe('airconditionerOn', () => {
    it('에어컨을 켜는 요청이 올바르게 호출되어야 한다', async () => {
      const id = 'device1';

      await service.airconditionerOn(id);

      expect(hejhomeApiService.setDeviceControl).toHaveBeenCalledWith(id, {
        requirments: {
          fanSpeed: 3,
          power: '켜짐',
          mode: 0,
          temperature: 18,
        },
      });
    });
  });

  describe('airconditionerOff', () => {
    it('에어컨을 끄는 요청이 올바르게 호출되어야 한다', async () => {
      const id = 'device1';

      await service.airconditionerOff(id);

      expect(hejhomeApiService.setDeviceControl).toHaveBeenCalledWith(id, {
        requirments: {
          fanSpeed: 3,
          power: '꺼짐',
          mode: 0,
          temperature: 18,
        },
      });
    });
  });
});
