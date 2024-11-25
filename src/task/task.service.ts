import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HejhomeMessageQueueService } from '../hejhome-message-queue/hejhome-message-queue.service';
import { DeviceCheckService } from './device-check.service';
import { RecipeCheckService } from './recipe-check.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private readonly hejhomeMessageQueueService: HejhomeMessageQueueService,
    private readonly deviceCheckService: DeviceCheckService,
    private readonly recipeCheckService: RecipeCheckService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async checkRecipeEvery1Minute() {
    try {
      await this.recipeCheckService.checkReserveTimeRecipes();
    } catch (error) {
      this.logger.error(`1분 주기 레시피 체크 실패: ${error.message}`);
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async checkDevicesEvery30Seconds() {
    if (this.shouldSkipApiCheck()) {
      return;
    }
    try {
      await this.deviceCheckService.checkDevices();
    } catch (error) {
      this.logger.error(`30초 주기 장치 체크 실패: ${error.message}`);
    }
  }

  private shouldSkipApiCheck(): boolean {
    if (this.hejhomeMessageQueueService.isConnected()) {
      this.logger.log('MQ가 연결되어 있어 API 체크를 건너뜁니다');
      return true;
    }
    this.logger.debug('API 체크를 시작합니다');
    return false;
  }
}
