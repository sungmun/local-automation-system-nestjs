import { Injectable } from '@nestjs/common';

@Injectable()
export class TimerManagerService {
  private timers: Map<string, NodeJS.Timeout> = new Map();

  async promiseSetTimer(key: string, delay: number) {
    return new Promise((resolve) => {
      const timer = this.setTimer(key, () => resolve(true), delay);
      resolve(timer);
    });
  }

  setTimer(key: string, callback: () => void, delay: number) {
    if (this.timers.has(key)) return false;
    const timer = setTimeout(() => {
      callback();
      this.timers.delete(key);
    }, delay);
    this.timers.set(key, timer);
    return true;
  }

  clearTimer(key: string) {
    const timer = this.timers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(key);
    }
  }
}
