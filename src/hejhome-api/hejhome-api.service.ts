import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as http from 'http';
import * as https from 'https';
import {
  ResponseAccessToken,
  ResponseDevice,
  ResponseDeviceStatus,
  ResponseHome,
  ResponseHomeWithRooms,
  ResponseSensorTHStatus,
} from './hejhome-api.interface';
import axios, { Axios, AxiosError, AxiosInstance } from 'axios';

@Injectable()
export class HejhomeApiService {
  private authInstance: AxiosInstance;
  private instance: AxiosInstance;
  private readonly logger = new Logger(HejhomeApiService.name);
  constructor(private readonly configService: ConfigService) {
    const clientId = configService.get('CLIENT_ID');
    const clientSecret = configService.get('CLIENT_SECRET');
    this.authInstance = axios.create({
      baseURL: 'https://goqual.io/oauth',
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true }),
      auth: {
        username: clientId,
        password: clientSecret,
      },
    });
    this.instance = axios.create({
      baseURL: 'https://goqual.io/openapi',
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true }),
    });
  }

  setAccessToken(accessToken: string) {
    this.logger.debug(accessToken);
    this.instance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }

  async getAccessToken(refreshToken: string) {
    const response = await this.authInstance
      .postForm<ResponseAccessToken>('/token', {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      })
      .catch((error: AxiosError) => {
        this.logger.error(
          `getAccessToken(${error.response.status}) :${JSON.stringify(error.response.data)}`,
        );

        throw error;
      });

    return response.data;
  }

  async getRoomWithDevices(hoomId: number, roomId: number) {
    const response = await this.instance
      .get<ResponseDevice[]>(`/homes/${hoomId}/rooms/${roomId}/devices`)
      .catch((error: AxiosError) => {
        this.logger.error(
          `getRoomWithDevices(${error.response.status}) :${JSON.stringify(error.response.data)}`,
        );

        throw error;
      });
    return response.data;
  }

  async getDevices() {
    const response = await this.instance
      .get<ResponseDevice[]>(`/devices`)
      .catch((error: AxiosError) => {
        this.logger.error(
          `getDevices(${error.response.status}) :${JSON.stringify(error.response.data)}`,
        );

        throw error;
      });
    return response.data;
  }

  async getDeviceStatus<T extends ResponseDeviceStatus>(deviceId: number) {
    const response = await this.instance
      .get<T>(`/device/${deviceId}`)
      .catch((error: AxiosError) => {
        this.logger.error(
          `getDeviceStatus(${error.response.status}) :${JSON.stringify(error.response.data)}`,
        );

        throw error;
      });
    return response.data;
  }

  async getDeviceRawStatus(deviceId: number) {
    const response = await this.instance
      .get<ResponseSensorTHStatus>(`/device/TH/${deviceId}`)
      .catch((error: AxiosError) => {
        this.logger.error(
          `getDeviceRawStatus(${error.response.status}) :${JSON.stringify(error.response.data)}`,
        );

        throw error;
      });
    return response.data;
  }

  async getHomes() {
    const response = await this.instance
      .get<ResponseHome>('/homes')
      .catch((error: AxiosError) => {
        this.logger.error(
          `getHomes(${error.response.status}) :${JSON.stringify(error.response.data)}`,
        );

        throw error;
      });
    return response.data.result;
  }

  async getHomeWithRooms(homeId: number) {
    const response = await this.instance
      .get<ResponseHomeWithRooms>(`/homes/${homeId}/rooms`)
      .catch((error: AxiosError) => {
        this.logger.error(
          `getHomeWithRooms(${error.response.status}) :${JSON.stringify(error.response.data)}`,
        );

        throw error;
      });
    return response.data;
  }
}
