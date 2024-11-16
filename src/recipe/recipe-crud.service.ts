import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './entities/recipe.entity';
import { DeviceCommand } from './entities/device-command.entity';
import { DataBaseDeviceService } from '../device/database-device.service';
import { instanceToPlain } from 'class-transformer';
import { CreateDeviceCommandDto } from './dto/create-device-command.dto';

@Injectable()
export class RecipeCrudService {
  private readonly logger = new Logger(RecipeCrudService.name);
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    @InjectRepository(DeviceCommand)
    private deviceCommandRepository: Repository<DeviceCommand>,
    private databaseDeviceService: DataBaseDeviceService,
  ) {}

  private async createDeviceCommands(deviceCommands: CreateDeviceCommandDto[]) {
    const devices = await this.databaseDeviceService.findInIds(
      deviceCommands.map((deviceCommand) => deviceCommand.deviceId),
    );
    const deviceSet = new Map(devices.map((device) => [device.id, device]));

    return deviceCommands.map((deviceCommand, order) => {
      if (!deviceSet.has(deviceCommand.deviceId)) {
        throw new NotFoundException(
          `Device with ID ${deviceCommand.deviceId} not found`,
        );
      }

      return this.deviceCommandRepository.create({
        ...instanceToPlain(deviceCommand),
        order,
        platform: deviceSet.get(deviceCommand.deviceId).platform,
      });
    });
  }

  async saveRecipe(createRecipeDto: CreateRecipeDto) {
    const deviceCommands = await this.createDeviceCommands(
      createRecipeDto.deviceCommands,
    );

    return this.recipeRepository.save({
      ...createRecipeDto,
      deviceCommands,
    });
  }

  async findAll() {
    return this.recipeRepository.find();
  }

  async findOne(id: number) {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: ['deviceCommands', 'recipeGroups', 'recipeGroups.conditions'],
    });

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    return recipe;
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto) {
    const { deviceCommands, recipeGroups, ...updateRecipe } =
      instanceToPlain(updateRecipeDto);

    if (!deviceCommands && !recipeGroups) {
      const result = await this.recipeRepository.update(id, updateRecipe);
      if (result.affected < 1) {
        throw new NotFoundException(`Recipe with ID ${id} not found`);
      }
      return;
    }
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: ['deviceCommands', 'recipeGroups', 'recipeGroups.conditions'],
    });

    if (recipe === null) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    if (deviceCommands) {
      recipe.deviceCommands = await this.createDeviceCommands(deviceCommands);
    }

    if (recipeGroups) {
      recipe.recipeGroups = recipeGroups;
    }
    await this.recipeRepository.save({ ...recipe, ...updateRecipe });
  }

  async remove(id: number) {
    return this.recipeRepository.delete(id);
  }
}
