import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';

import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoomCrudService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async findRoomById(roomId: number) {
    const room = await this.roomRepository.findOneBy({ id: roomId });
    if (room === null) {
      throw new NotFoundException('room not found error', `${roomId}`);
    }
    return room;
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

  async getRoomById<T extends keyof Room>(
    roomId: number,
    selectColumn?: T[],
  ): Promise<Pick<Room, T>> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      select: selectColumn,
    });
    if (room === null) {
      throw new NotFoundException('device not found error', `${roomId}`);
    }
    return room;
  }

  async updateRoom(id: string, room: Partial<Room>) {
    return this.roomRepository.update(id, room);
  }

  async findAll() {
    return this.roomRepository.find();
  }
}
