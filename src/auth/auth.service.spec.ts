import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';

jest.mock('fs/promises');

describe('AuthService', () => {
  let service: AuthService;
  let hejhomeApiService: HejhomeApiService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: HejhomeApiService,
          useValue: {
            getAccessToken: jest.fn(),
            setAccessToken: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    hejhomeApiService = module.get<HejhomeApiService>(HejhomeApiService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('서비스가 정의되어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('setRefreshToken', () => {
    it('토큰이 만료되지 않았을 때 설정해야 한다', async () => {
      const mockData = {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
        expires_in: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
      };
      jest.spyOn(path, 'join').mockReturnValue('hej-code.json');
      jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify(mockData));

      await service.setRefreshToken();

      expect(configService.set).toHaveBeenCalledWith(
        'HEJ_HOME_ACCESS_TOKEN',
        mockData.access_token,
      );
      expect(configService.set).toHaveBeenCalledWith(
        'HEJ_HOME_REFRESH_TOKEN',
        mockData.refresh_token,
      );
      expect(hejhomeApiService.setAccessToken).toHaveBeenCalledWith(
        mockData.access_token,
      );
    });

    it('토큰이 만료되었을 때 갱신해야 한다', async () => {
      const mockData = {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
        expires_in: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      };
      const newTokenData = {
        access_token: 'new_access_token',
        refresh_token: 'new_refresh_token',
        expires_in: 3600,
        token_type: 'bearer',
        scope: 'openapi',
      };
      jest.spyOn(path, 'join').mockReturnValue('hej-code.json');
      jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify(mockData));
      jest
        .spyOn(hejhomeApiService, 'getAccessToken')
        .mockResolvedValue(newTokenData);

      await service.setRefreshToken();

      expect(hejhomeApiService.getAccessToken).toHaveBeenCalledWith(
        mockData.refresh_token,
      );
    });
  });
});
