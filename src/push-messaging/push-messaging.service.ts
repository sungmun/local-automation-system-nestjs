import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Axios } from 'axios';
import * as http from 'http';
import * as https from 'https';
import { LogService } from '../log/log.service';

@Injectable()
export class PushMessagingService {
  private readonly logger = new Logger(PushMessagingService.name);
  private readonly pushInstance: Axios;
  constructor(
    private readonly configService: ConfigService,
    private readonly logService: LogService,
  ) {
    this.pushInstance = new Axios({
      baseURL: 'https://ntfy.sh',
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true }),
    });
  }

  async sendMessage(title: string, message: string) {
    const uri = this.configService.get('NTFY_URI');
    this.logService.log(`${title} - ${message}`, {
      type: 'PUSH_MESSAGE',
    });
    this.logger.log(`Sending message to ${uri}: ${title} - ${message}`);
    await this.pushInstance.post(uri, message, {
      headers: {
        Title: `=?UTF-8?B?${Buffer.from(title).toString('base64')}?=`,
      },
    });
  }
}
