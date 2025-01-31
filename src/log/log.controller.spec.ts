import { Test, TestingModule } from '@nestjs/testing';
import { LogController } from './log.controller';
import { LogService } from './log.service';

describe('LogController', () => {
  let controller: LogController;
  let service: LogService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogController],
      providers: [
        {
          provide: LogService,
          useValue: {
            autoDeviceChangeLog: jest.fn(),
            findLogs: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LogController>(LogController);
    service = module.get<LogService>(LogService);
  });

  it('컨트롤러가 정의되어야 한다', () => {
    expect(controller).toBeDefined();
  });

  describe('findLogs', () => {
    it('findLogs 에서 findLogs 를 호출해야 한다', async () => {
      await controller.findLogs();
      expect(service.findLogs).toHaveBeenCalled();
    });
  });
});
