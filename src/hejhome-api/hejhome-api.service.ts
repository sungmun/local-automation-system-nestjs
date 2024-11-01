import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as http from 'http';
import * as https from 'https';
import {
  RequestDeviceControl,
  ResponseAccessToken,
  ResponseDevice,
  ResponseDeviceState,
  ResponseDeviceStateError,
  ResponseHome,
  ResponseHomeWithRooms,
  ResponseSensorTHState,
} from './hejhome-api.interface';
import { Axios, AxiosError, AxiosResponse } from 'axios';

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
      transformResponse: (data) => {
        return JSON.parse(data as unknown as string);
      },
    });
  }

  private axiosErrorHandler(methodName: string) {
    return (error: AxiosError): never => {
      if (error.isAxiosError) {
        this.logger.error(
          `${methodName}(${error.response.status}) :${JSON.stringify(error.response.data || {})}`,
        );
      }
      throw error;
    };
  }

  private hejhomeApiErrorHandler<T extends object>(methodName: string) {
    return (response: AxiosResponse<T>) => {
      if ('message' in response.data) {
        this.logger.error(`${methodName} : ${response.data.message}`);
        throw new Error(response.data.message as string);
      }
      return response;
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
      .then(this.hejhomeApiErrorHandler('getRoomWithDevices'))
      .catch(this.axiosErrorHandler('getRoomWithDevices'));
    return response.data;
  }

  async getDevices() {
    const response = await this.instance
      .get<ResponseDevice[]>(`/devices`)
      .then(this.hejhomeApiErrorHandler('getDevices'))
      .catch(this.axiosErrorHandler('getDevices'));
    return response.data;
  }

  async getDeviceState<
    T extends ResponseDeviceState | ResponseDeviceStateError,
  >(deviceId: string) {
    const response = await this.instance
      .get<T>(`/device/${deviceId}`)
      .then(this.hejhomeApiErrorHandler('getDeviceState'))
      .catch(this.axiosErrorHandler('getDeviceState'));
    return response.data;
  }

  async getDeviceRawState(deviceId: string) {
    const response = await this.instance
      .get<ResponseSensorTHState>(`/device/TH/${deviceId}`)
      .then(this.hejhomeApiErrorHandler('getDeviceRawState'))
      .catch(this.axiosErrorHandler('getDeviceRawState'));
    return response.data;
  }

  async getHomes() {
    const response = await this.instance
      .get<ResponseHome>('/homes')
      .then(this.hejhomeApiErrorHandler('getHomes'))
      .catch(this.axiosErrorHandler('getHomes'));

    return response.data.result;
  }

  async getHomeWithRooms(homeId: number) {
    const response = await this.instance
      .get<ResponseHomeWithRooms>(`/homes/${homeId}/rooms`)
      .then(this.hejhomeApiErrorHandler('getHomeWithRooms'))
      .catch(this.axiosErrorHandler('getHomeWithRooms'));
    return response.data;
  }

  async setDeviceControl<T>(id: string, body: RequestDeviceControl<T>) {
    await this.instance
      .post(`/control/${id}`, body)
      .then(this.hejhomeApiErrorHandler('setDeviceControl'))
      .catch(this.axiosErrorHandler('setDeviceControl'));
  }
}
