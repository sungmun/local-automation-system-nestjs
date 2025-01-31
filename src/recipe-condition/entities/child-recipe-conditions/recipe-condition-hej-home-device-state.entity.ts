import { ChildEntity, Column, JoinColumn, ManyToOne } from 'typeorm';
import {
  RecipeCondition,
  RecipeConditionType,
} from '../recipe-condition.entity';
import { Device } from '../../../device/entities/device.entity';
import { ComparisonOperator } from '../../validators/base.validator';

@ChildEntity(RecipeConditionType.HEJ_HOME_DEVICE_STATE)
export class RecipeConditionHejHomeDeviceState extends RecipeCondition {
  @Column({
    type: 'text',
    transformer: {
      to: (value: object): string => JSON.stringify(value),
      from: (value: string): object => JSON.parse(value),
    },
  })
  deviceState: Record<
    string,
    {
      unit: ComparisonOperator;
      value: string | number;
    }
  >;

  @Column()
  deviceId: string;

  @ManyToOne(() => Device, (device) => device.hejHomeRecipeConditions)
  @JoinColumn({ name: 'deviceId' })
  device: Device;
}
