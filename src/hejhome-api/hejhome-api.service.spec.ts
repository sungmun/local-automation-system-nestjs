import { Test, TestingModule } from '@nestjs/testing';
import { HejhomeApiService } from './hejhome-api.service';
import { ConfigService } from '@nestjs/config';

import { AxiosError } from 'axios';
import {
  ResponseAccessToken,
  ResponseDevice,
  ResponseHome,
  ResponseHomeWithRooms,
  ResponseIrAirconditionerState,
  ResponseSensorTHState,
  RequestDeviceControl,
  IrAirconditionerControl,
} from './hejhome-api.interface';

describe('HejhomeApiService', () => {
  let service: HejhomeApiService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HejhomeApiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-client-id'),
          },
        },
      ],
    }).compile();

    service = module.get<HejhomeApiService>(HejhomeApiService);
    service.setAccessToken('test-access-token');
    configService = module.get<ConfigService>(ConfigService);
  });

  const errorProcessTest = async (
    beforeErrorSpy: jest.SpyInstance,
    method: () => Promise<any>,
    errorData?: any,
  ) => {
    const errorMessage = 'Network Error';
    const error = new AxiosError(errorMessage, 'ERR_NETWORK', {} as any, null, {
      status: 500,
      data: errorData,
      headers: {},
      config: {} as any,
      statusText: 'Internal Server Error',
    });
    beforeErrorSpy.mockRejectedValueOnce(error);

    await expect(method()).rejects.toThrow(errorMessage);
  };
  describe('getAccessToken', () => {
    it('성공적으로 액세스 토큰을 받아야 한다', async () => {
      const mockResponse: ResponseAccessToken = {
        access_token: 'test-access-token',
        token_type: 'Bearer',
        refresh_token: 'test-refresh-token',
        expires_in: 3600,
        scope: 'read',
      };
      const postFormSpy = jest
        .spyOn(service['authInstance'], 'postForm')
        .mockResolvedValueOnce({ data: mockResponse });

      const result = await service.getAccessToken('test-refresh-token');

      expect(result).toEqual(mockResponse);
      expect(postFormSpy).toHaveBeenCalledWith('/token', {
        grant_type: 'refresh_token',
        refresh_token: 'test-refresh-token',
      });
    });

    describe('오류를 처리해야 한다', () => {
      let logSpy;
      beforeEach(async () => {
        logSpy = jest
          .spyOn(service['logger'], 'error')
          .mockImplementation(() => {});
      });
      it('오류 응답데이터가 있다', async () => {
        await errorProcessTest(
          jest.spyOn(service['authInstance'], 'postForm'),
          async () => service.getAccessToken('test-refresh-token'),
          { message: 'test-error-message' },
        );

        expect(logSpy).toHaveBeenCalledWith(
          `getAccessToken(500) :{"message":"test-error-message"}`,
        );
      });
      it('오류 응답데이터가 없다', async () => {
        await errorProcessTest(
          jest.spyOn(service['authInstance'], 'postForm'),
          () => service.getAccessToken('test-refresh-token'),
        );
        expect(logSpy).toHaveBeenCalledWith(`getAccessToken(500) :{}`);
      });
    });
  });

  describe('getRoomWithDevices', () => {
    it('올바른 데이터를 반환해야 한다', async () => {
      const mockResponse: ResponseDevice[] = [
        {
          id: '1',
          name: 'Device 1',
          deviceType: 'Sensor',
          hasSubDevices: false,
          modelName: 'Model 1',
          familyId: 'Family 1',
          category: 'Category 1',
          online: true,
        },
      ];
      const getSpy = jest
        .spyOn(service['instance'], 'get')
        .mockResolvedValueOnce({ data: mockResponse });

      const result = await service.getRoomWithDevices(1, 1);

      expect(result).toEqual(mockResponse);
      expect(getSpy).toHaveBeenCalledWith('/homes/1/rooms/1/devices');
    });

    describe('오류를 처리해야 한다', () => {
      let logSpy;
      beforeEach(async () => {
        logSpy = jest
          .spyOn(service['logger'], 'error')
          .mockImplementation(() => {});
      });

      it('오류 응답데이터가 있다', async () => {
        await errorProcessTest(
          jest.spyOn(service['instance'], 'get'),
          () => service.getRoomWithDevices(1, 1),
          { message: 'test-error-message' },
        );
        expect(logSpy).toHaveBeenCalledWith(
          `getRoomWithDevices(500) :{"message":"test-error-message"}`,
        );
      });

      it('오류 응답데이터가 없다', async () => {
        await errorProcessTest(jest.spyOn(service['instance'], 'get'), () =>
          service.getRoomWithDevices(1, 1),
        );
        expect(logSpy).toHaveBeenCalledWith('getRoomWithDevices(500) :{}');
      });
    });
  });

  describe('getDevices', () => {
    it('올바른 데이터를 반환해야 한다', async () => {
      const mockResponse: ResponseDevice[] = [
        {
          id: '1',
          name: 'Device 1',
          deviceType: 'Sensor',
          hasSubDevices: false,
          modelName: 'Model 1',
          familyId: 'Family 1',
          category: 'Category 1',
          online: true,
        },
      ];
      const getSpy = jest
        .spyOn(service['instance'], 'get')
        .mockResolvedValueOnce({ data: mockResponse });

      const result = await service.getDevices();

      expect(result).toEqual(mockResponse);
      expect(getSpy).toHaveBeenCalledWith('/devices');
    });

    describe('오류를 처리해야 한다', () => {
      let logSpy;
      beforeEach(async () => {
        logSpy = jest
          .spyOn(service['logger'], 'error')
          .mockImplementation(() => {});
      });

      it('오류 응답데이터가 있다', async () => {
        await errorProcessTest(
          jest.spyOn(service['instance'], 'get'),
          () => service.getDevices(),
          { message: 'test-error-message' },
        );
        expect(logSpy).toHaveBeenCalledWith(
          `getDevices(500) :{"message":"test-error-message"}`,
        );
      });

      it('오류 응답데이터가 없다', async () => {
        await errorProcessTest(jest.spyOn(service['instance'], 'get'), () =>
          service.getDevices(),
        );
        expect(logSpy).toHaveBeenCalledWith('getDevices(500) :{}');
      });
    });
  });

  describe('getDeviceState', () => {
    it('올바른 데이터를 반환해야 한다', async () => {
      const mockResponse: ResponseIrAirconditionerState = {
        id: 'device-id',
        deviceType: 'IrAirconditioner',
        deviceState: {
          power: '켜짐',
          temperature: '24',
          mode: 1,
          fanSpeed: 2,
        },
      };
      const getSpy = jest
        .spyOn(service['instance'], 'get')
        .mockResolvedValueOnce({ data: mockResponse });

      const result = await service.getDeviceState('device-id');

      expect(result).toEqual(mockResponse);
      expect(getSpy).toHaveBeenCalledWith('/device/device-id');
    });

    describe('오류를 처리해야 한다', () => {
      let logSpy;
      beforeEach(async () => {
        logSpy = jest
          .spyOn(service['logger'], 'error')
          .mockImplementation(() => {});
      });

      it('오류 응답데이터가 있다', async () => {
        await errorProcessTest(
          jest.spyOn(service['instance'], 'get'),
          () => service.getDeviceState('device-id'),
          { message: 'test-error-message' },
        );
        expect(logSpy).toHaveBeenCalledWith(
          `getDeviceState(500) :{"message":"test-error-message"}`,
        );
      });

      it('오류 응답데이터가 없다', async () => {
        await errorProcessTest(jest.spyOn(service['instance'], 'get'), () =>
          service.getDeviceState('device-id'),
        );
        expect(logSpy).toHaveBeenCalledWith('getDeviceState(500) :{}');
      });
    });
  });

  describe('getDeviceRawState', () => {
    it('올바른 데이터를 반환해야 한다', async () => {
      const mockResponse: ResponseSensorTHState = {
        id: 'device-id',
        deviceType: 'SensorTh',
        deviceState: {
          temperature: 22,
          humidity: 50,
          battery: 80,
        },
      };
      const getSpy = jest
        .spyOn(service['instance'], 'get')
        .mockResolvedValueOnce({ data: mockResponse });

      const result = await service.getDeviceRawState('device-id');

      expect(result).toEqual(mockResponse);
      expect(getSpy).toHaveBeenCalledWith('/device/TH/device-id');
    });

    describe('오류를 처리해야 한다', () => {
      let logSpy;
      beforeEach(async () => {
        logSpy = jest
          .spyOn(service['logger'], 'error')
          .mockImplementation(() => {});
      });

      it('오류 응답데이터가 있다', async () => {
        await errorProcessTest(
          jest.spyOn(service['instance'], 'get'),
          () => service.getDeviceRawState('device-id'),
          { message: 'test-error-message' },
        );
        expect(logSpy).toHaveBeenCalledWith(
          `getDeviceRawState(500) :{"message":"test-error-message"}`,
        );
      });

      it('오류 응답데이터가 없다', async () => {
        await errorProcessTest(jest.spyOn(service['instance'], 'get'), () =>
          service.getDeviceRawState('device-id'),
        );
        expect(logSpy).toHaveBeenCalledWith('getDeviceRawState(500) :{}');
      });
    });
  });

  describe('getHomes', () => {
    it('올바른 데이터를 반환해야 한다', async () => {
      const mockResponse: ResponseHome = {
        result: [{ name: 'Home 1', homeId: 1 }],
      };
      const getSpy = jest
        .spyOn(service['instance'], 'get')
        .mockResolvedValueOnce({ data: mockResponse });

      const result = await service.getHomes();

      expect(result).toEqual(mockResponse.result);
      expect(getSpy).toHaveBeenCalledWith('/homes');
    });

    describe('오류를 처리해야 한다', () => {
      let logSpy;
      beforeEach(async () => {
        logSpy = jest
          .spyOn(service['logger'], 'error')
          .mockImplementation(() => {});
      });

      it('오류 응답데이터가 있다', async () => {
        await errorProcessTest(
          jest.spyOn(service['instance'], 'get'),
          () => service.getHomes(),
          { message: 'test-error-message' },
        );
        expect(logSpy).toHaveBeenCalledWith(
          `getHomes(500) :{"message":"test-error-message"}`,
        );
      });

      it('오류 응답데이터가 없다', async () => {
        await errorProcessTest(jest.spyOn(service['instance'], 'get'), () =>
          service.getHomes(),
        );
        expect(logSpy).toHaveBeenCalledWith('getHomes(500) :{}');
      });
    });
  });

  describe('getHomeWithRooms', () => {
    it('올바른 데이터를 반환해야 한다', async () => {
      const mockResponse: ResponseHomeWithRooms = {
        home: 'Home 1',
        rooms: [{ name: 'Room 1', room_id: 1 }],
      };
      const getSpy = jest
        .spyOn(service['instance'], 'get')
        .mockResolvedValueOnce({ data: mockResponse });

      const result = await service.getHomeWithRooms(1);

      expect(result).toEqual(mockResponse);
      expect(getSpy).toHaveBeenCalledWith('/homes/1/rooms');
    });

    describe('오류를 처리해야 한다', () => {
      let logSpy;
      beforeEach(async () => {
        logSpy = jest
          .spyOn(service['logger'], 'error')
          .mockImplementation(() => {});
      });

      it('오류 응답데이터가 있다', async () => {
        await errorProcessTest(
          jest.spyOn(service['instance'], 'get'),
          () => service.getHomeWithRooms(1),
          { message: 'test-error-message' },
        );
        expect(logSpy).toHaveBeenCalledWith(
          `getHomeWithRooms(500) :{"message":"test-error-message"}`,
        );
      });

      it('오류 응답데이터가 없다', async () => {
        await errorProcessTest(jest.spyOn(service['instance'], 'get'), () =>
          service.getHomeWithRooms(1),
        );
        expect(logSpy).toHaveBeenCalledWith('getHomeWithRooms(500) :{}');
      });
    });
  });

  describe('setDeviceControl', () => {
    it('올바르게 호출되어야 한다', async () => {
      const controlRequest: RequestDeviceControl<IrAirconditionerControl> = {
        requirments: {
          power: '켜짐',
          temperature: 24,
          fanSpeed: 3,
          mode: 1,
        },
      };

      const postSpy = jest
        .spyOn(service['instance'], 'post')
        .mockResolvedValueOnce({});

      await service.setDeviceControl('device-id', controlRequest);

      expect(postSpy).toHaveBeenCalledWith(
        '/control/device-id',
        controlRequest,
      );
    });

    describe('오류를 처리해야 한다', () => {
      let logSpy;
      beforeEach(async () => {
        logSpy = jest
          .spyOn(service['logger'], 'error')
          .mockImplementation(() => {});
      });

      it('오류 응답데이터가 있다', async () => {
        await errorProcessTest(
          jest.spyOn(service['instance'], 'post'),
          () => service.setDeviceControl('device-id', {} as any),
          { message: 'test-error-message' },
        );
        expect(logSpy).toHaveBeenCalledWith(
          `setDeviceControl(500) :{"message":"test-error-message"}`,
        );
      });

      it('오류 응답데이터가 없다', async () => {
        await errorProcessTest(jest.spyOn(service['instance'], 'post'), () =>
          service.setDeviceControl('device-id', {} as any),
        );
        expect(logSpy).toHaveBeenCalledWith('setDeviceControl(500) :{}');
      });
    });
  });
});
