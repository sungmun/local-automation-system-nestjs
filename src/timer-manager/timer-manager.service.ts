import { Injectable } from '@nestjs/common';

@Injectable()
export class TimerManagerService {
  private timers: Map<string, NodeJS.Timeout> = new Map();

  setTimer(key: string, callback: () => void, delay: number) {
    if (this.timers.has(key)) return false;
    const timer = setTimeout(callback, delay);
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
