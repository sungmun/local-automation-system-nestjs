import { Injectable } from '@nestjs/common';

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
export class RecipeService {
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
      const createdDeviceCommand = this.deviceCommandRepository.create({
        ...instanceToPlain(deviceCommand),
        order,
        platform: deviceSet.get(deviceCommand.deviceId).platform,
      });

      return createdDeviceCommand;
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

  findAll() {
    return this.recipeRepository.find();
  }

  findOne(id: number) {
    return this.recipeRepository.findOne({
      where: { id },
      relations: ['deviceCommands'],
    });
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto) {
    const { deviceCommands, ...updateRecipe } =
      instanceToPlain(updateRecipeDto);
    if (deviceCommands) {
      const [recipe, makeDeviceCommands] = await Promise.all([
        this.recipeRepository.findOne({
          where: { id },
          relations: ['deviceCommands'],
        }),
        this.createDeviceCommands(deviceCommands),
      ]);
      recipe.deviceCommands = makeDeviceCommands;

      await this.recipeRepository.save({ ...recipe, ...updateRecipe });
    } else {
      await this.recipeRepository.update(id, updateRecipe);
    }
  }

  remove(id: number) {
    return this.recipeRepository.delete(id);
  }
}
