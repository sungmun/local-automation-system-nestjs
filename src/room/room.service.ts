import { Injectable, NotFoundException } from '@nestjs/common';
import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';
import { ResponseHome } from '../hejhome-api/hejhome-api.interface';
import { Room } from './entities/room.entity';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceControlService } from '../device-control/device-control.service';
import { DataBaseDeviceService } from '../device/database-device.service';
import { UpdateRoomDto } from './dto/updateRoom.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly hejhomeApiService: HejhomeApiService,
    private readonly deviceControlService: DeviceControlService,
    private readonly databaseDeviceService: DataBaseDeviceService,
  ) {}

  async setRoomById(roomId: number, updateRoomDto: UpdateRoomDto) {
    if (Object.keys(updateRoomDto).length === 0) return false;
    const updated = await this.roomRepository.update(roomId, updateRoomDto);
    return updated.affected === 1;
  }

  async setRoomActiveById(roomId: number) {
    await this.roomRepository
      .createQueryBuilder()
      .update(Room)
      .set({
        active: () => `CASE WHEN id = :roomId THEN true ELSE false END`,
      })
      .setParameters({ roomId })
      .execute();
  }

  async getRoomById(roomId: number) {
    const room = await this.roomRepository.findOneBy({ id: roomId });
    if (room === null) {
      throw new NotFoundException('device not found error', `${roomId}`);
    }
    return room;
  }

  async getRoomsWithHomeId(homes: ResponseHome['result']) {
    const roomsWithHomeId = await Promise.all(
      homes.map(async ({ homeId }) => {
        const homeWithRooms =
          await this.hejhomeApiService.getHomeWithRooms(homeId);
        return homeWithRooms.rooms.map((room) =>
          Object.assign(room, { homeId }),
        );
      }),
    );
    return roomsWithHomeId.flat();
  }

  async getHomesWithRooms() {
    const homes: ResponseHome['result'] =
      await this.hejhomeApiService.getHomes();
    return this.getRoomsWithHomeId(homes);
  }

  async updateRoom(id: string, room: Room) {
    return this.roomRepository.update(id, room);
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

  async initRooms(rooms: Room[]) {
    this.roomRepository
      .createQueryBuilder()
      .insert()
      .values(rooms)
      .orIgnore()
      .execute();
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

  async activeRoomTemperatureControl(temperature: number) {
    const room = await this.roomRepository.findOne({ where: { active: true } });

    if (room === null) return;
    const { acStartTemperature, acStopTemperature } = room;

    const devices =
      await this.databaseDeviceService.getDevicesByRoomOrUnassignedAndDeviceType(
        room.id,
        'IrAirconditioner',
      );

    let excuteFun;
    if (temperature > acStartTemperature) {
      excuteFun = this.deviceControlService.airconditionerOn;
    } else if (temperature < acStopTemperature) {
      excuteFun = this.deviceControlService.airconditionerOff;
    }

    if (excuteFun === undefined) return;

    await Promise.all(
      devices.map(async (device) => await excuteFun(device.id)),
    );
  }
}
