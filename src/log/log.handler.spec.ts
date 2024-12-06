import { Test, TestingModule } from '@nestjs/testing';
import { LogService } from './log.service';
import { ResponseDeviceState } from '../hejhome-api/hejhome-api.interface';
import { LogHandler } from './log.handler';

describe('LogHandler', () => {
  let handler: LogHandler;
  let service: LogService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        LogHandler,
        {
          provide: LogService,
          useValue: {
            autoDeviceChangeLog: jest.fn(),
            findLogs: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<LogHandler>(LogHandler);
    service = module.get<LogService>(LogService);
  });

  it('헨들러가 정의되어야 한다', () => {
    expect(handler).toBeDefined();
  });

  describe('autoDeviceLog', () => {
    it('autoDeviceLog 에서 autoDeviceChangeLog 를 호출해야 한다', async () => {
      const state = {} as ResponseDeviceState;
      await handler.autoDeviceLog(state);
      expect(service.autoDeviceChangeLog).toHaveBeenCalledWith(state);
    });
  });
});
