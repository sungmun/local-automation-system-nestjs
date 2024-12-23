import { Test, TestingModule } from '@nestjs/testing';
import { RecipeCommandService } from './recipe-command.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  RecipeCommand,
  RecipeCommandPlatform,
} from './entities/recipe-command.entity';
import { CommandRunnerFactory } from './runners/command-runner.factory';
import { DataBaseDeviceService } from '../device/database-device.service';
import { Device } from '../device/entities/device.entity';
import { HejHomeRecipeCommandRequestDto } from './dto/request';

describe('RecipeCommandService', () => {
  let service: RecipeCommandService;
  let recipeCommandRepository: jest.Mocked<any>;
  let commandRunnerFactory: jest.Mocked<CommandRunnerFactory>;
  let databaseDeviceService: jest.Mocked<DataBaseDeviceService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeCommandService,
        {
          provide: getRepositoryToken(RecipeCommand),
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: CommandRunnerFactory,
          useValue: {
            getRunner: jest.fn(),
          },
        },
        {
          provide: DataBaseDeviceService,
          useValue: {
            findInIds: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RecipeCommandService>(RecipeCommandService);
    recipeCommandRepository = module.get(getRepositoryToken(RecipeCommand));
    commandRunnerFactory = module.get(CommandRunnerFactory);
    databaseDeviceService = module.get(DataBaseDeviceService);
  });

  it('서비스가 정의되어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('createRecipeCommands', () => {
    const recipeCommands: HejHomeRecipeCommandRequestDto[] = [
      {
        command: { test: 'test' },
        deviceId: 'device123',
        name: '장치 명령',
        platform: RecipeCommandPlatform.HEJ_HOME,
      },
    ];

    it('레시피 명령을 생성해야 합니다', async () => {
      const device = { id: 'device123', platform: 'device-hejhome' } as Device;
      databaseDeviceService.findInIds.mockResolvedValue([device]);
      recipeCommandRepository.create.mockReturnValue({
        ...recipeCommands[0],
        order: 0,
      });

      const result = await service.createRecipeCommands(recipeCommands);

      expect(recipeCommandRepository.create).toHaveBeenCalledWith({
        ...recipeCommands[0],
        order: 0,
        platform: 'device-hejhome',
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('runCommands', () => {
    it('레시피 명령을 순서대로 실행해야 합니다', async () => {
      const mockRunner = {
        execute: jest.fn().mockResolvedValue(undefined),
        canHandle: jest.fn().mockResolvedValue(true),
      };
      const commands = [
        { id: 1, order: 0 },
        { id: 2, order: 1 },
      ] as RecipeCommand[];

      commandRunnerFactory.getRunner.mockReturnValue(mockRunner);

      await service.runCommands(commands);

      expect(commandRunnerFactory.getRunner).toHaveBeenCalledTimes(2);
      expect(mockRunner.execute).toHaveBeenCalledTimes(2);
    });

    it('실행 중 에러가 발생하면 에러를 전파해야 합니다', async () => {
      const error = new Error('실행 에러');
      const mockRunner = {
        canHandle: jest.fn().mockResolvedValue(true),
        execute: jest.fn().mockRejectedValue(error),
      };
      const commands = [{ id: 1, order: 0 }] as RecipeCommand[];

      commandRunnerFactory.getRunner.mockReturnValue(mockRunner);

      await expect(service.runCommands(commands)).rejects.toThrow(error);
    });
  });
});
