import { Test, TestingModule } from '@nestjs/testing';
import { RoomController } from './room.controller';
import { RoomCrudService } from './room-crud.service';
import { plainToInstance } from 'class-transformer';
import { ListRoomResponseDto } from './dto/response/list-room-response.dto';

describe('RoomController', () => {
  let controller: RoomController;
  let roomCrudService: RoomCrudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomController],
      providers: [
        {
          provide: RoomCrudService,
          useValue: {
            findAll: jest.fn(),
            setRoomActiveById: jest.fn(),
            getRoomById: jest.fn(),
            setRoomById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RoomController>(RoomController);
    roomCrudService = module.get<RoomCrudService>(RoomCrudService);
  });

  it('컨트롤러가 정의되어야 한다', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('모든 방 목록을 반환해야 한다', async () => {
      const findAllResult = [
        { id: 1, name: '거실' },
        { id: 2, name: '안방' },
      ];
      jest.spyOn(roomCrudService, 'findAll').mockResolvedValue(findAllResult);
      const result = await controller.findAll();

      expect(result).toEqual(
        plainToInstance(ListRoomResponseDto, { list: findAllResult }),
      );
      expect(roomCrudService.findAll).toHaveBeenCalled();
    });
  });

  describe('setActiveRoom', () => {
    it('방을 활성화하고 해당 방 정보를 반환해야 한다', async () => {
      const roomId = 1;
      const room = { id: roomId, name: '거실', active: true };

      jest
        .spyOn(roomCrudService, 'setRoomActiveById')
        .mockResolvedValue(undefined);
      jest.spyOn(roomCrudService, 'getRoomById').mockResolvedValue(room);

      const result = await controller.setActiveRoom(roomId);

      expect(roomCrudService.setRoomActiveById).toHaveBeenCalledWith(roomId);
      expect(roomCrudService.getRoomById).toHaveBeenCalledWith(roomId);
      expect(result).toBe(room);
    });
  });
});
