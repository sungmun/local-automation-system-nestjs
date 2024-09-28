import got from 'got';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import * as http from 'http';
import * as https from 'https';

import { Injectable } from '@nestjs/common';
import { HejhomeApiService } from 'src/hejhome-api/hejhome-api.service';

@Injectable()
export class AuthService {
  private readonly gotInstance: got.GotInstance<any>;

  constructor(
    private readonly configService: ConfigService,
    private readonly hejhomeApiService: HejhomeApiService,
  ) {}

  async refreshToken() {
    const heyCodePath = path.join(process.env.PWD, 'hey-code.json');
    const heyCode = require(heyCodePath);
    const refreshToken = heyCode.refresh_token;
    if (Date.now() - 24 * 60 * 1000 > Date.parse(heyCode.expires_in)) {
      return;
    }

    try {
      const response =
        await this.hejhomeApiService.getAccessToken(refreshToken);

      const data = response.body as any;
      const expiresIn = new Date(Date.now() + data.expires_in * 1000);

      this.configService.set('HEY_HOME_ACCESS_TOKEN', data.access_token);
      await fs.writeFile(
        heyCodePath,
        JSON.stringify({ ...data, expires_in: expiresIn }),
      );
    } catch (error) {
      if (error.response) {
        // logger.error('hey home token refresh error', {
        //   data: error.response.body,
        // });
      } else {
        // logger.error('unexpected error', { data: error });
      }
      throw error;
    }
  }
}
