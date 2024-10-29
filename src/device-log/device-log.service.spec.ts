import { Test, TestingModule } from '@nestjs/testing';
import { DeviceLogService } from './device-log.service';
import { DeviceLog } from './entities/device-log.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('DeviceLogService', () => {
  let service: DeviceLogService;
  let deviceLogRepository: Repository<DeviceLog>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceLogService,
        {
          provide: getRepositoryToken(DeviceLog),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<DeviceLogService>(DeviceLogService);
    deviceLogRepository = module.get<Repository<DeviceLog>>(
      getRepositoryToken(DeviceLog),
    );
  });

  it('서비스가 정의되어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('log', () => {
    it('로그를 저장해야 한다', async () => {
      const createSpy = jest
        .spyOn(deviceLogRepository, 'create')
        .mockReturnValue({
          id: null,
          deviceId: '1',
          logMessage: 'type1 - test',
          type: 'type1',
          createdAt: null,
        });
      const saveSpy = jest
        .spyOn(deviceLogRepository, 'save')
        .mockResolvedValue(null);
      service.log('test', {
        deviceId: '1',
        type: 'type1',
      });
      expect(createSpy).toHaveBeenCalledWith({
        deviceId: '1',
        logMessage: 'type1 - test',
        type: 'type1',
      });
      expect(saveSpy).toHaveBeenCalled();
    });
  });

  describe('autoChangeLog', () => {
    it('ResponseDeviceState 기반으로 로그 데이터를 기록합니다', async () => {
      const logSpy = jest.spyOn(service, 'log').mockResolvedValue(null);

      service.autoChangeLog({
        id: '1',
        deviceState: {},
        deviceType: 'type1',
      });
      expect(logSpy).toHaveBeenCalledWith('[type1](1) / {}', {
        deviceId: '1',
        type: 'AUTO_CHANGE',
      });
    });
  });
});
