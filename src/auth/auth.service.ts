import * as fs from 'fs/promises';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly hejhomeApiService: HejhomeApiService,
  ) {}

  async setRefreshToken() {
    const hejCodePath = path.join(process.env.PWD, 'hej-code.json');
    const hejCodeContent = await fs.readFile(hejCodePath, 'utf-8');
    const hejCode: FileHejCode = JSON.parse(hejCodeContent);

    const refreshToken = hejCode.refresh_token;

    const expiredAt = Date.parse(hejCode.expires_in || '2000-01-01');

    if (Date.now() - 24 * 60 * 1000 < expiredAt) {
      this.logger.log('token is not expired', hejCode.expires_in);
      this.setEnvLoginToken(hejCode.access_token, hejCode.refresh_token);
      return;
    }

    const data = await this.hejhomeApiService.getAccessToken(refreshToken);

    const expiresIn = new Date(Date.now() + data.expires_in * 1000);

    this.setEnvLoginToken(hejCode.access_token, hejCode.refresh_token);

    await fs.writeFile(
      hejCodePath,
      JSON.stringify({ ...data, expires_in: expiresIn }),
    );
  }

  private async setEnvLoginToken(accessToken: string, refreshToken: string) {
    this.configService.set('HEJ_HOME_ACCESS_TOKEN', accessToken);
    this.configService.set('HEJ_HOME_REFRESH_TOKEN', refreshToken);
    this.hejhomeApiService.setAccessToken(accessToken);
  }
}
