export class RoomDto {
  id: number;
  name: string;
  temperature?: number;
  humidity?: number;
  sensorId?: string;
  active?: boolean;
}
