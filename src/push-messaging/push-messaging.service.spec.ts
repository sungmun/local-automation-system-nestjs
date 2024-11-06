import { Test, TestingModule } from '@nestjs/testing';
import { PushMessagingService } from './push-messaging.service';
import { ConfigService } from '@nestjs/config';
import { LogService } from '../log/log.service';

describe('PushMessagingService', () => {
  let service: PushMessagingService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PushMessagingService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-uri'),
          },
        },
        {
          provide: LogService,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PushMessagingService>(PushMessagingService);
    configService = module.get<ConfigService>(ConfigService);
    jest.spyOn(service['logger'], 'log').mockReturnValue();
  });

  it('서비스가 정의되어야 한다', () => {
    expect(service).toBeDefined();
  });

  it('올바른 제목과 메시지로 메시지를 보내야 한다', async () => {
    const title = 'Test Title';
    const message = 'Test Message';
    const postSpy = jest
      .spyOn(service['pushInstance'], 'post')
      .mockResolvedValue({});
    const logSpy = jest.spyOn(service['logger'], 'log');
    await service.sendMessage(title, message);

    expect(configService.get).toHaveBeenCalledWith('NTFY_URI');
    expect(logSpy).toHaveBeenCalledWith(
      `Sending message to test-uri: ${title} - ${message}`,
    );
    expect(postSpy).toHaveBeenCalledWith('test-uri', message, {
      headers: {
        Title: `=?UTF-8?B?${Buffer.from(title).toString('base64')}?=`,
      },
    });
  });
});
