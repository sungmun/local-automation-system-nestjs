import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './room.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { RecipeConditionService } from '../recipe-condition/recipe-condition.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('RoomService', () => {
  let service: RoomService;
  let roomRepository: Repository<Room>;
  let recipeConditionService: RecipeConditionService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomService,
        {
          provide: getRepositoryToken(Room),
          useClass: Repository,
        },
        {
          provide: RecipeConditionService,
          useValue: {
            checkRoomRecipeConditions: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RoomService>(RoomService);
    roomRepository = module.get<Repository<Room>>(getRepositoryToken(Room));
    recipeConditionService = module.get<RecipeConditionService>(
      RecipeConditionService,
    );
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('서비스가 정의되어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('initRooms', () => {
    it('방 목록을 초기화해야 한다', async () => {
      const createQueryBuilder: any = {
        insert: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        orIgnore: jest.fn().mockReturnThis(),
        execute: jest.fn(),
      };

      jest
        .spyOn(roomRepository, 'createQueryBuilder')
        .mockReturnValue(createQueryBuilder);

      const rooms = [
        { id: 1, name: '거실' },
        { id: 2, name: '안방' },
      ] as Room[];

      await service.initRooms(rooms);

      expect(createQueryBuilder.insert).toHaveBeenCalled();
      expect(createQueryBuilder.values).toHaveBeenCalledWith(rooms);
      expect(createQueryBuilder.orIgnore).toHaveBeenCalled();
      expect(createQueryBuilder.execute).toHaveBeenCalled();
    });
  });

  describe('activeRoomRecipe', () => {
    it('센서 ID로 방을 찾아 레시피 조건을 확인하고 이벤트를 발생시켜야 한다', async () => {
      const room = {
        id: 1,
        sensorId: 'sensor1',
        recipeConditionsTemperature: [],
        recipeConditionsHumidity: [],
      } as Room;

      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(room);
      jest
        .spyOn(recipeConditionService, 'checkRoomRecipeConditions')
        .mockResolvedValue([1, 2]);

      const emitSpy = jest.spyOn(eventEmitter, 'emit');

      await service.activeRoomRecipe('sensor1');

      expect(roomRepository.findOne).toHaveBeenCalledWith({
        where: { sensorId: 'sensor1' },
        relations: [
          'recipeConditionsTemperature',
          'recipeConditionsHumidity',
          'recipeConditionsTemperature.group',
          'recipeConditionsHumidity.group',
        ],
      });

      expect(
        recipeConditionService.checkRoomRecipeConditions,
      ).toHaveBeenCalledWith(room);
      expect(emitSpy).toHaveBeenCalledTimes(2);
      expect(emitSpy).toHaveBeenCalledWith('recipe.condition.check', {
        recipeId: 1,
      });
      expect(emitSpy).toHaveBeenCalledWith('recipe.condition.check', {
        recipeId: 2,
      });
    });

    it('방을 찾지 못하면 아무 동작도 하지 않아야 한다', async () => {
      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(null);
      const checkRoomRecipeConditionsSpy = jest.spyOn(
        recipeConditionService,
        'checkRoomRecipeConditions',
      );
      const emitSpy = jest.spyOn(eventEmitter, 'emit');

      await service.activeRoomRecipe('nonexistent-sensor');

      expect(checkRoomRecipeConditionsSpy).not.toHaveBeenCalled();
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });
});
