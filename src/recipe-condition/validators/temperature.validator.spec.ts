import '../entities/child-recipe-conditions';
import { TemperatureValidator } from './temperature.validator';
import { ValidationContext } from './validation-context';
import {
  RecipeCondition,
  RecipeConditionType,
} from '../entities/recipe-condition.entity';
import { Room } from '../../room/entities/room.entity';
import { RoomCrudService } from '../../room/room-crud.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('TemperatureValidator', () => {
  let validator: TemperatureValidator;
  let roomCrudService: jest.Mocked<RoomCrudService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemperatureValidator,
        {
          provide: RoomCrudService,
          useValue: {
            findRoomById: jest.fn(),
          },
        },
      ],
    }).compile();

    validator = module.get<TemperatureValidator>(TemperatureValidator);
    roomCrudService = module.get(RoomCrudService);
  });

  it('검증 가능한 클래스가 정의되어야 한다', () => {
    expect(validator).toBeDefined();
  });

  describe('canHandle', () => {
    it('온도 타입의 조건을 처리할 수 있어야 합니다', () => {
      const condition = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
      } as unknown as RecipeCondition;

      expect(validator.canHandle(condition)).toBe(true);
    });

    it('온도 타입이 아닌 조건은 처리할 수 없어야 합니다', () => {
      const condition = {
        type: RecipeConditionType.ROOM_HUMIDITY,
      } as unknown as RecipeCondition;

      expect(validator.canHandle(condition)).toBe(false);
    });
  });

  describe('validate', () => {
    it('온도 조건이 충족되면 true를 반환해야 합니다', async () => {
      const condition = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
        temperature: 2500,
        unit: '>',
      } as unknown as RecipeCondition;

      const room = {
        temperature: 2600,
      } as Room;
      roomCrudService.findRoomById.mockResolvedValue(room);
      const context = new ValidationContext(condition, { room });

      const result = await validator.validate(context);
      expect(result).toBe(true);
    });

    it('온도 조건이 충족되지 않으면 false를 반환해야 합니다', async () => {
      const condition = {
        type: RecipeConditionType.ROOM_TEMPERATURE,
        temperature: 2500,
        unit: '>',
      } as unknown as RecipeCondition;

      const room = {
        temperature: 2400,
      } as Room;
      roomCrudService.findRoomById.mockResolvedValue(room);
      const context = new ValidationContext(condition, { room });

      const result = await validator.validate(context);
      expect(result).toBe(false);
    });
  });
});
