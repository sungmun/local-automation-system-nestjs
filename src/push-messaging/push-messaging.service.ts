import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class PushMessagingService {
  pushInstance: AxiosInstance;
  constructor(private readonly configService: ConfigService) {
    this.pushInstance = axios.create({
      baseURL: 'https://ntfy.sh',
    });
  }

  async sendMessage(title: string, message: string) {
    const uri = this.configService.get('NTFY_URI');
    await this.pushInstance.post(uri, message, {
      headers: { Title: title },
    });
  }
}
