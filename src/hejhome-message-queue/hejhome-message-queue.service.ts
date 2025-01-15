import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class HejhomeMessageQueueService {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly configService: ConfigService,
  ) {}

  isConnected(): boolean {
    if (this.configService.get('HEJHOME_MESSAGE_QUEUE_ENABLE') === 'false') {
      return false;
    }
    return this.amqpConnection.connected;
  }
}
