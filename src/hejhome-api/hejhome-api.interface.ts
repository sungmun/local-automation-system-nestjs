export interface ResponseDeviceStatus {
  Id: string;
  deviceType: string;
  status: {
    [key: string]: any;
  };
}

export interface ResponseIrAirconditionerStatus extends ResponseDeviceStatus {
  deviceType: 'IrAirconditioner';
  status: ResponseIrAirconditioner;
}

export interface ResponseSensorTHStatus extends ResponseDeviceStatus {
  deviceType: 'SensorTh';
  status: ResponseSensorTH;
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
