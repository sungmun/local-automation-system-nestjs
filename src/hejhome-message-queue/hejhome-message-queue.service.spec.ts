import { Test, TestingModule } from '@nestjs/testing';
import { HejhomeMessageQueueService } from './hejhome-message-queue.service';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';

describe('HejhomeMessageQueueService', () => {
  let service: HejhomeMessageQueueService;
  let amqpConnection: AmqpConnection;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HejhomeMessageQueueService,
        {
          provide: AmqpConnection,
          useValue: {
            connected: true,
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('true'),
          },
        },
      ],
    }).compile();

    service = module.get<HejhomeMessageQueueService>(
      HejhomeMessageQueueService,
    );
    amqpConnection = module.get<AmqpConnection>(AmqpConnection);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('서비스가 정의되어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('isConnected', () => {
    it('MQ가 비활성화되어 있으면 false를 반환해야 한다', () => {
      jest.spyOn(configService, 'get').mockReturnValue('false');
      expect(service.isConnected()).toBe(false);
    });

    it('MQ가 활성화되어 있고 연결되어 있으면 true를 반환해야 한다', () => {
      (amqpConnection as any)['connected'] = true;
      expect(service.isConnected()).toBe(true);
    });

    it('MQ가 활성화되어 있지만 연결되어 있지 않으면 false를 반환해야 한다', () => {
      (amqpConnection as any)['connected'] = false;
      expect(service.isConnected()).toBe(false);
    });
  });
});
