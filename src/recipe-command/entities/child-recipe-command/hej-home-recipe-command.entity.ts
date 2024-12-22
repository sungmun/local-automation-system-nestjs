import { ChildEntity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { RecipeCommand, RecipeCommandPlatform } from '../recipe-command.entity';
import { Device } from '../../../device/entities/device.entity';

@ChildEntity(RecipeCommandPlatform.HEJ_HOME)
export class HejHomeRecipeCommand extends RecipeCommand {
  @Column({
    type: 'text',
    transformer: {
      to: (value: object): string => {
        return JSON.stringify(value);
      },
      from: (value: string): object => {
        return JSON.parse(value);
      },
    },
  })
  command: object;

  @Column()
  deviceId: string;

  @ManyToOne(() => Device, (device) => device.deviceCommands, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'deviceId' })
  device: Device;
}
