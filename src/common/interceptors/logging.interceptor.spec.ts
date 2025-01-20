import { LoggingInterceptor } from './logging.interceptor';
import { ExecutionContext, Logger } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { Request, Response } from 'express';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let mockContext: ExecutionContext;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    interceptor = new LoggingInterceptor();

    mockRequest = {
      method: 'GET',
      url: '/test',
      ip: '127.0.0.1',
    };

    mockResponse = {
      statusCode: 200,
    };

    mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
    } as ExecutionContext;

    jest.spyOn(Logger.prototype, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('인터셉터가 정의되어야 한다', () => {
    expect(interceptor).toBeDefined();
  });

  it('요청과 응답을 로깅해야 한다', (done) => {
    const logSpy = jest.spyOn(Logger.prototype, 'log');
    const next = {
      handle: () => of({}),
    };

    const obs = interceptor.intercept(mockContext, next);

    obs.subscribe(() => {
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringMatching(/GET \/test 200 \d+ms - 127\.0\.0\.1/),
      );
      done();
    });
  });

  it('응답 시간을 측정해야 한다', async () => {
    jest.useFakeTimers();
    const logSpy = jest.spyOn(Logger.prototype, 'log');
    const next = {
      handle: () =>
        new Observable((subscriber) => {
          setTimeout(() => {
            subscriber.next({});
            subscriber.complete();
          }, 1000);
        }),
    };

    const obs = interceptor.intercept(mockContext, next);

    const promise = new Promise((resolve) => {
      obs.subscribe(() => {
        const logCall = logSpy.mock.calls[0][0];
        const responseTime = parseInt(logCall.match(/(\d+)ms/)[1]);
        expect(responseTime).toBeGreaterThanOrEqual(1000);
        resolve(undefined);
      });
    });
    jest.advanceTimersByTime(1000);
    await promise;
  });
});
