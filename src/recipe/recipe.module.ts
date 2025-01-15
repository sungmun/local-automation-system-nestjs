import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Recipe } from './entities/recipe.entity';

import { RecipeController } from './recipe.controller';
import { RecipeHandler } from './recipe.handler';

import { DeviceModule } from '../device/device.module';
import { RecipeConditionModule } from '../recipe-condition/recipe-condition.module';

import { RecipeCrudService } from './recipe-crud.service';
import { RecipeService } from './recipe.service';
import { RecipeCommandModule } from '../recipe-command/recipe-command.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipe]),
    DeviceModule,
    RecipeConditionModule,
    RecipeCommandModule,
  ],
  controllers: [RecipeController],
  providers: [RecipeService, RecipeCrudService, RecipeHandler],
  exports: [RecipeService, RecipeCrudService],
})
export class RecipeModule {}
