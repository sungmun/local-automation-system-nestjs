import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class PushMessagingService {
  private readonly logger = new Logger(PushMessagingService.name);
  private readonly pushInstance: AxiosInstance;
  constructor(private readonly configService: ConfigService) {
    this.pushInstance = axios.create({
      baseURL: 'https://ntfy.sh',
    });
  }

  async sendMessage(title: string, message: string) {
    const uri = this.configService.get('NTFY_URI');
    this.logger.log(`Sending message to ${uri}: ${title} - ${message}`);
    await this.pushInstance.post(uri, message, {
      headers: {
        Title: `=?UTF-8?B?${Buffer.from(title).toString('base64')}?=`,
      },
    });
  }
}
