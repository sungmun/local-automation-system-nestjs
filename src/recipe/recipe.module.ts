import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { DeviceCommand } from './entities/device-command.entity';
import { DeviceModule } from '../device/device.module';
import { RecipeConditionGroup } from './entities/recipe-condition-group.entity';
import {
  RecipeCondition,
  RecipeConditionRoomHumidity,
  RecipeConditionRoomTemperature,
} from './entities/recipe-condition.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Recipe,
      DeviceCommand,
      RecipeConditionGroup,
      RecipeCondition,
      RecipeConditionRoomTemperature,
      RecipeConditionRoomHumidity,
    ]),
    DeviceModule,
  ],
  controllers: [RecipeController],
  providers: [RecipeService],
  exports: [RecipeService],
})
export class RecipeModule {}
