import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as http from 'http';
import * as https from 'https';
import {
  RequestDeviceControl,
  ResponseAccessToken,
  ResponseDevice,
  ResponseDeviceState,
  ResponseHome,
  ResponseHomeWithRooms,
  ResponseSensorTHState,
} from './hejhome-api.interface';
import { Axios, AxiosError } from 'axios';

@Injectable()
export class HejhomeApiService {
  private authInstance: Axios;
  private instance: Axios;
  private readonly logger = new Logger(HejhomeApiService.name);

  constructor(private readonly configService: ConfigService) {
    const clientId = configService.get('CLIENT_ID');
    const clientSecret = configService.get('CLIENT_SECRET');
    this.authInstance = new Axios({
      baseURL: 'https://goqual.io/oauth',
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true }),
      auth: {
        username: clientId,
        password: clientSecret,
      },
    });
  }

  setAccessToken(accessToken: string) {
    this.logger.debug('accessToken', accessToken);

    this.instance = new Axios({
      baseURL: 'https://goqual.io/openapi',
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  private axiosErrorHandler(methodName: string) {
    return (error: AxiosError): never => {
      this.logger.error(
        `${methodName}(${error.response.status}) :${JSON.stringify(error.response.data || {})}`,
      );
      throw error;
    };
  }

  async getAccessToken(refreshToken: string) {
    const response = await this.authInstance
      .postForm<ResponseAccessToken>('/token', {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      })
      .catch(this.axiosErrorHandler('getAccessToken'));

    return response.data;
  }

  async getRoomWithDevices(hoomId: number, roomId: number) {
    const response = await this.instance
      .get<ResponseDevice[]>(`/homes/${hoomId}/rooms/${roomId}/devices`)
      .catch(this.axiosErrorHandler('getRoomWithDevices'));
    return response.data;
  }

  async getDevices() {
    const response = await this.instance
      .get<ResponseDevice[]>(`/devices`)
      .catch(this.axiosErrorHandler('getDevices'));
    return response.data;
  }

  async getDeviceState<T extends ResponseDeviceState>(deviceId: string) {
    const response = await this.instance
      .get<T>(`/device/${deviceId}`)
      .catch(this.axiosErrorHandler('getDeviceState'));
    return response.data;
  }

  async getDeviceRawState(deviceId: string) {
    const response = await this.instance
      .get<ResponseSensorTHState>(`/device/TH/${deviceId}`)
      .catch(this.axiosErrorHandler('getDeviceRawState'));
    return response.data;
  }

  async getHomes() {
    const response = await this.instance
      .get<ResponseHome>('/homes')
      .catch(this.axiosErrorHandler('getHomes'));
    return response.data.result;
  }

  async getHomeWithRooms(homeId: number) {
    const response = await this.instance
      .get<ResponseHomeWithRooms>(`/homes/${homeId}/rooms`)
      .catch(this.axiosErrorHandler('getHomeWithRooms'));
    return response.data;
  }

  async setDeviceControl<T>(id: string, body: RequestDeviceControl<T>) {
    await this.instance
      .post(`/control/${id}`, body)
      .catch(this.axiosErrorHandler('setDeviceControl'));
  }
}
