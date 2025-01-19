import { Test, TestingModule } from '@nestjs/testing';
import { TimerManagerService } from './timer-manager.service';

describe('TimerManagerService', () => {
  let service: TimerManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimerManagerService],
    }).compile();

    service = module.get<TimerManagerService>(TimerManagerService);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('서비스가 정의되어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('promiseSetTimer', () => {
    it('타이머를 설정하고 Promise를 반환해야 합니다', async () => {
      const promise = service.promiseSetTimer('test', 1000);
      expect(service['timers'].has('test')).toBe(true);
      await expect(promise).resolves.toBe(true);
    });

    it('이미 존재하는 키로 타이머를 설정하면 false를 반환해야 합니다', async () => {
      await service.promiseSetTimer('test', 1000);
      const result = await service.promiseSetTimer('test', 1000);
      expect(result).toBe(false);
    });

    it('타이머가 만료되면 true를 반환해야 합니다', async () => {
      const promise = service.promiseSetTimer('test', 1000);

      // 타이머 실행
      jest.advanceTimersByTime(1000);

      // Promise가 true로 resolve 되었는지 확인
      await expect(promise).resolves.toBe(true);

      // 타이머가 제거되었는지 확인
      expect(service['timers'].has('test')).toBe(false);
    });

    it('타이머가 만료되기 전에 clearTimer가 호출되면 타이머가 제거되어야 합니다', async () => {
      const promise = service.promiseSetTimer('test', 1000);

      // 타이머 실행 전에 clear
      service.clearTimer('test');

      // Promise가 이미 resolve 되었는지 확인
      await expect(promise).resolves.toBe(true);

      // 타이머가 제거되었는지 확인
      expect(service['timers'].has('test')).toBe(false);

      // 원래 예정된 시간이 지나도 타이머가 없어야 함
      jest.advanceTimersByTime(1000);
      expect(service['timers'].has('test')).toBe(false);
    });
  });

  describe('setTimer', () => {
    it('타이머를 설정하고 true를 반환해야 합니다', () => {
      const callback = jest.fn();
      const result = service.setTimer('test', callback, 1000);
      expect(result).toBe(true);
      expect(service['timers'].has('test')).toBe(true);
    });

    it('이미 존재하는 키로 타이머를 설정하면 false를 반환해야 합니다', () => {
      const callback = jest.fn();
      service.setTimer('test', callback, 1000);
      const result = service.setTimer('test', callback, 1000);
      expect(result).toBe(false);
      expect(service['timers'].size).toBe(1);
    });

    it('지정된 시간 후에 콜백을 실행해야 합니다', () => {
      const callback = jest.fn();
      service.setTimer('test', callback, 1000);

      expect(callback).not.toHaveBeenCalled();
      jest.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalled();
    });

    it('콜백 실행 후 타이머가 제거되어야 합니다', () => {
      const callback = jest.fn();
      service.setTimer('test', callback, 1000);

      jest.advanceTimersByTime(1000);
      expect(service['timers'].has('test')).toBe(false);
    });
  });

  describe('clearTimer', () => {
    it('타이머를 제거해야 합니다', () => {
      const callback = jest.fn();
      service.setTimer('test', callback, 1000);
      service.clearTimer('test');

      expect(service['timers'].has('test')).toBe(false);
      jest.advanceTimersByTime(1000);
      expect(callback).not.toHaveBeenCalled();
    });

    it('존재하지 않는 타이머를 제거하려고 해도 에러가 발생하지 않아야 합니다', () => {
      expect(() => service.clearTimer('nonexistent')).not.toThrow();
    });
  });
});
