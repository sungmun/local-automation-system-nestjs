import { Injectable } from '@nestjs/common';
import { ResponseHome } from '../hejhome-api/hejhome-api.interface';
import { HejhomeApiService } from '../hejhome-api/hejhome-api.service';

@Injectable()
export class HejHomeRoomService {
  constructor(private readonly hejhomeApiService: HejhomeApiService) {}

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
}
