import { Test, TestingModule } from '@nestjs/testing';
import { LogService } from './log.service';
import { Log } from './entities/log.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('LogService', () => {
  let service: LogService;
  let LogRepository: Repository<Log>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogService,
        {
          provide: getRepositoryToken(Log),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<LogService>(LogService);
    LogRepository = module.get<Repository<Log>>(getRepositoryToken(Log));
  });

  it('서비스가 정의되어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('log', () => {
    it('로그를 저장해야 한다', async () => {
      const saveSpy = jest.spyOn(LogRepository, 'save').mockResolvedValue(null);
      service.log('test', {
        deviceId: '1',
        type: 'type1',
      });

      expect(saveSpy).toHaveBeenCalled();
    });
  });

  describe('autoDeviceChangeLog', () => {
    it('ResponseDeviceState 기반으로 로그 데이터를 기록합니다', async () => {
      const logSpy = jest.spyOn(service, 'log').mockResolvedValue(null);

      service.autoDeviceChangeLog({
        id: '1',
        deviceState: {},
        deviceType: 'type1',
      });
      expect(logSpy).toHaveBeenCalledWith('[type1](1) / {}', {
        deviceId: '1',
        type: 'DEVICE_AUTO_CHANGE',
      });
    });
  });

  describe('findLogs', () => {
    it('findLogs 에서 find 를 호출해야 한다', async () => {
      const findSpy = jest.spyOn(LogRepository, 'find').mockResolvedValue([]);
      await service.findLogs();
      expect(findSpy).toHaveBeenCalled();
    });
  });
});
