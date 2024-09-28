import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got, { AgentOptions, GotBodyFn, GotFormFn, GotJSONFn } from 'got';
import * as http from 'http';
import * as https from 'https';

@Injectable()
export class HejhomeApiService {
  private gotAuthInstance: got.GotInstance<GotJSONFn>;
  private gotInstance: got.GotInstance<GotJSONFn>;
  constructor() {
    const agent: AgentOptions = {
      http: new http.Agent({ keepAlive: true }),
      https: new https.Agent({ keepAlive: true }),
    };
    this.gotInstance = got.extend({
      baseUrl: 'https://goqual.io',
      agent: agent,
      json: true,
    });
    this.gotAuthInstance = got.extend({
      baseUrl: 'https://goqual.io',
      agent: agent,
      json: true,
    });
  }

  setAccessToken(accessToken: string) {
    this.gotInstance = got.extend({
      headers: { authorization: `Bearer ${accessToken}` },
    });
  }

  async getAccessToken(refreshToken: string) {
    return this.gotAuthInstance.post('https://goqual.io/oauth/token', {
      body: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      },
      form: true,
      json: true,
    });
  }
}
