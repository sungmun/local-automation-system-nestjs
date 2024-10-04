import { Test, TestingModule } from '@nestjs/testing';
import { TimerManagerService } from './timer-manager.service';

describe('TimerManagerService', () => {
  let service: TimerManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimerManagerService],
    }).compile();

    service = module.get<TimerManagerService>(TimerManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
