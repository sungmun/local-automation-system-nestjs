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

  async findAll() {
    return this.recipeRepository.find();
  }

  async findOne(id: number) {
    return this.recipeRepository.findOne({
      where: { id },
      relations: ['deviceCommands', 'recipeGroups', 'recipeGroups.conditions'],
    });
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto) {
    const { deviceCommands, recipeGroups, ...updateRecipe } =
      instanceToPlain(updateRecipeDto);

    if (!deviceCommands && !recipeGroups) {
      await this.recipeRepository.update(id, updateRecipe);
      return;
    }
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: ['deviceCommands', 'recipeGroups', 'recipeGroups.conditions'],
    });

    if (recipe === null) return;

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
