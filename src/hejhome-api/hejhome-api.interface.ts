export interface controlRequest {}

export interface RequestDeviceControl<T extends controlRequest> {
  requirments: T;
}

export interface IrAirconditionerControl extends controlRequest {
  power: '켜짐' | '꺼짐';
  temperature: number;
  fanSpeed: number;
  mode: number;
}
export interface ResponseDeviceState {
  id: string;
  deviceType: string;
  deviceState: {
    [key: string]: any;
  };
}

export interface ResponseIrAirconditionerState extends ResponseDeviceState {
  deviceType: 'IrAirconditioner';
  deviceState: ResponseIrAirconditioner;
}

export interface ResponseSensorTHState extends ResponseDeviceState {
  deviceType: 'SensorTh';
  deviceState: ResponseSensorTH;
}

interface ResponseSensorTH {
  temperature: number;
  humidity: number;
  battery: number;
}

interface ResponseIrAirconditioner {
  power: string;
  temperature: string;
  mode: number;
  fanSpeed: number;
}

export interface ResponseAccessToken {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}

export interface ResponseDevice {
  id: string;
  name: string;
  deviceType: string;
  hasSubDevices: boolean;
  modelName: string;
  familyId: string;
  category: string;
  online: boolean;
}

export interface ResponseHome {
  result: {
    name: string;
    homeId: number;
  }[];
}

export interface ResponseRoom {
  name: string;
  room_id: number;
}

export interface ResponseHomeWithRooms {
  home: string;
  rooms: ResponseRoom[];
}
