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

  it('서비스가 정의되어야 한다', () => {
    expect(service).toBeDefined();
  });

  it('타이머를 설정해야 한다', () => {
    const callback = jest.fn();
    service.setTimer('test', callback, 1000);
    expect(service['timers'].has('test')).toBe(true);
  });

  it('키가 이미 존재하면 타이머를 설정하지 않아야 한다', () => {
    const callback = jest.fn();
    service.setTimer('test', callback, 1000);
    service.setTimer('test', callback, 1000);
    expect(service['timers'].size).toBe(1);
  });

  it('타이머를 제거해야 한다', () => {
    const callback = jest.fn();
    service.setTimer('test', callback, 1000);
    service.clearTimer('test');
    expect(service['timers'].has('test')).toBe(false);
  });

  it('지연 후 콜백을 호출해야 한다', (done) => {
    const callback = jest.fn(() => {
      expect(callback).toHaveBeenCalled();
      done();
    });
    service.setTimer('test', callback, 100);
  });
});
