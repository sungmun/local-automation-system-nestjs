import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoomSensorService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async updateRoomBySensorId(sensorId: string, room: Partial<Room>) {
    return this.roomRepository.update({ sensorId }, room);
  }

  async findRoomBySensorId(sensorId: string) {
    const room = await this.roomRepository.findOneBy({ sensorId });
    if (room === null) {
      throw new NotFoundException('room not found sensorId error', sensorId);
    }
    return room;
  }

  async setRoomTemperature(id: string, temperature: number) {
    const room = await this.findRoomBySensorId(id);
    return this.roomRepository.update(room.id, { temperature });
  }

  async matchRoomWithSensor(id: number) {
    const room = await this.roomRepository.findOne({
      where: { id },
      relations: ['devices'],
    });

    const roomSensor = room.devices.find(
      (device) => device.deviceType === 'SensorTh',
    );
    if (roomSensor === undefined) return;

    await this.roomRepository.update(id, { sensorId: roomSensor.id });
  }
}
