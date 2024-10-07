import { Test, TestingModule } from '@nestjs/testing';
import { HejhomeMessageQueueService } from './hejhome-message-queue.service';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

describe('HejhomeMessageQueueService', () => {
  let service: HejhomeMessageQueueService;
  let amqpConnection: AmqpConnection;

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
      ],
    }).compile();

    service = module.get<HejhomeMessageQueueService>(
      HejhomeMessageQueueService,
    );
    amqpConnection = module.get<AmqpConnection>(AmqpConnection);
  });

  it('서비스가 정의되어야 한다', () => {
    expect(service).toBeDefined();
  });

  it('연결되어 있을 때 true를 반환해야 한다', () => {
    (amqpConnection as any)['connected'] = true;
    expect(service.isConnected()).toBe(true);
  });

  it('연결되어 있지 않을 때 false를 반환해야 한다', () => {
    (amqpConnection as any)['connected'] = false;
    expect(service.isConnected()).toBe(false);
  });
});
