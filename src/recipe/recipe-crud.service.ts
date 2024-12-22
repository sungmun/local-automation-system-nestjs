import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { FindOptionsRelations, FindOptionsWhere } from 'typeorm';
import { Recipe } from './entities/recipe.entity';
import { DeviceCommand } from './entities/device-command.entity';
import { DataBaseDeviceService } from '../device/database-device.service';
import { instanceToPlain } from 'class-transformer';
import { CreateDeviceCommandRequestDto } from './dto/request/create-device-command-request.dto';
import { CreateRecipeRequestDto } from './dto/request/create-recipe-request.dto';
import { UpdateRecipeRequestDto } from './dto/request/update-recipe-request.dto';

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

  private async createDeviceCommands(
    deviceCommands: CreateDeviceCommandRequestDto[],
  ) {
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

  async saveRecipe(createRecipeDto: CreateRecipeRequestDto) {
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

  async update(id: number, updateRecipeDto: UpdateRecipeRequestDto) {
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

  async findOneAndUpdate(
    where: FindOptionsWhere<Recipe>,
    findOptionsRelation: FindOptionsRelations<Recipe>,
    updateSet: Partial<Recipe>,
  ) {
    const updateResult = await this.recipeRepository.update(where, updateSet);
    if (updateResult.affected < 1) {
      throw new NotFoundException(
        `Recipe with where ${JSON.stringify(where)} not found`,
      );
    }

    return this.recipeRepository.findOne({
      where,
      relations: findOptionsRelation,
    });
  }
}
