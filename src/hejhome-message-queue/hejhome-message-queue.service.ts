import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
@Injectable()
export class HejhomeMessageQueueService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  isConnected(): boolean {
    return this.amqpConnection.connected;
  }
}
