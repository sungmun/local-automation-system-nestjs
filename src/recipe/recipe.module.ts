import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RecipeController } from './recipe.controller';
import { Recipe } from './entities/recipe.entity';
import { DeviceCommand } from './entities/device-command.entity';
import { DeviceModule } from '../device/device.module';
import { HejhomeApiModule } from '../hejhome-api/hejhome-api.module';
import { TimerManagerModule } from '../timer-manager/timer-manager.module';
import { RecipeConditionModule } from '../recipe-condition/recipe-condition.module';

import { RecipeCrudService } from './recipe-crud.service';
import { RecipeService } from './recipe.service';
import { RecipeCommandService } from './recipe-command.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipe, DeviceCommand]),
    DeviceModule,
    HejhomeApiModule,
    TimerManagerModule,
    RecipeConditionModule,
  ],
  controllers: [RecipeController],
  providers: [RecipeService, RecipeCrudService, RecipeCommandService],
  exports: [RecipeService, RecipeCrudService],
})
export class RecipeModule {}
