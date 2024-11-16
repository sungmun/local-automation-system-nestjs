import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeConditionService } from './recipe-condition.service';
import { RecipeConditionGroup } from './entities/recipe-condition-group.entity';
import {
  RecipeCondition,
  RecipeConditionRoomHumidity,
  RecipeConditionRoomTemperature,
} from './entities/recipe-condition.entity';

import { ConditionValidatorFactory } from './validators/condition-validator.factory';
import { ValidatorRegistry } from './validators/validator.registry';
import { IConditionValidator } from './validators/condition-validator.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RecipeConditionGroup,
      RecipeCondition,
      RecipeConditionRoomTemperature,
      RecipeConditionRoomHumidity,
    ]),
  ],
  providers: [
    RecipeConditionService,
    ValidatorRegistry,
    {
      provide: 'CONDITION_VALIDATORS',
      useFactory: () => {
        const validatorTypes = ValidatorRegistry.getValidators();
        return validatorTypes.map((validatorType) => new validatorType());
      },
    },
    {
      provide: ConditionValidatorFactory,
      useFactory: (validators: IConditionValidator[]) =>
        new ConditionValidatorFactory(validators),
      inject: ['CONDITION_VALIDATORS'],
    },
  ],
  exports: [RecipeConditionService],
})
export class RecipeConditionModule {}
