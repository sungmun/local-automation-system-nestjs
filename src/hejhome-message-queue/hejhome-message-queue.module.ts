import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { HejhomeMessageQueueService } from './hejhome-message-queue.service';
import { HejhomeMessageQueueController } from './hejhome-message-queue.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `amqps://${configService.get('CLIENT_ID')}:${configService.get('CLIENT_SECRET')}@goqual.io:55001/`,
        connectionInitOptions: { wait: false },
        connectionManagerOptions: {
          heartbeatIntervalInSeconds: 60,
          reconnectTimeInSeconds: 60,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [HejhomeMessageQueueController],
  providers: [HejhomeMessageQueueService],
  exports: [HejhomeMessageQueueService],
})
export class HejhomeMessageQueueModule {}
