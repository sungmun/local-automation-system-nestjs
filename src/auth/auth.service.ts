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

  async refreshToken() {
    const heyCodePath = path.join(process.env.PWD, 'hej-code.json');
    const heyCode: FileHeyCode = require(heyCodePath);

    const refreshToken = heyCode.refresh_token;

    const expiredAt = Date.parse(heyCode.expires_in);

    if (Date.now() - 24 * 60 * 1000 < expiredAt) {
      this.logger.log('token is not expired', heyCode.expires_in);
      this.setEnvLoginToken(heyCode.access_token, heyCode.refresh_token);
      return;
    }

    const data = await this.hejhomeApiService.getAccessToken(refreshToken);

    const expiresIn = new Date(Date.now() + data.expires_in * 1000);

    this.setEnvLoginToken(heyCode.access_token, heyCode.refresh_token);

    await fs.writeFile(
      heyCodePath,
      JSON.stringify({ ...data, expires_in: expiresIn }),
    );
  }

  private async setEnvLoginToken(accessToken: string, refreshToken: string) {
    this.configService.set('HEY_HOME_ACCESS_TOKEN', accessToken);
    this.configService.set('HEY_HOME_REFRESH_TOKEN', refreshToken);
    this.hejhomeApiService.setAccessToken(accessToken);
  }
}
