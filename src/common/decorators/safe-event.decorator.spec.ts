import { Logger } from '@nestjs/common';
import { OnSafeEvent } from './safe-event.decoratot';

describe('SafeEventDecorator', () => {
  class TestClass {
    @OnSafeEvent('test.event')
    async testMethod() {
      throw new Error('테스트 에러');
    }
  }

  it('에러가 발생해도 로그만 기록하고 정상 처리되어야 합니다', async () => {
    const testInstance = new TestClass();
    const loggerSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation();

    await expect(testInstance.testMethod()).resolves.not.toThrow();
    expect(loggerSpy).toHaveBeenCalledWith(expect.any(Error));
  });

  it('메타데이터가 올바르게 유지되어야 합니다', () => {
    const testInstance = new TestClass();
    const metadata = Reflect.getMetadataKeys(testInstance.testMethod);

    expect(metadata).toContain('EVENT_LISTENER_METADATA');
  });

  it('원본 메서드의 컨텍스트가 유지되어야 합니다', async () => {
    class ContextTestClass {
      private value = 'test';

      @OnSafeEvent('test.event')
      async testMethod() {
        return this.value;
      }
    }

    const instance = new ContextTestClass();
    const result = await instance.testMethod();

    expect(result).toBe('test');
  });
});
