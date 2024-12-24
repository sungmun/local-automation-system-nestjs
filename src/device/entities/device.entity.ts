import { HejHomeRecipeCommand } from '../../recipe-command/entities/child-recipe-command';
import { MessageTemplate } from '../../message-template/entities/message-template.entity';
import { Room } from '../../room/entities/room.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity('Devices')
export class Device {
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  deviceType: string;

  @Column({ type: 'text', nullable: true })
  modelName: string;

  @Column({ type: 'text' })
  familyId: string;

  @Column({ nullable: true })
  roomId?: number;

  @ManyToOne(() => Room)
  @JoinColumn({ name: 'roomId' })
  room?: Room;

  @Column({ type: 'text' })
  category: string;

  @Column()
  online: boolean;

  @Column()
  hasSubDevices: boolean;

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'text', nullable: true })
  platform?: string;

  @Column({ type: 'text', nullable: true, default: '{}' })
  state?: string;

  @Column({ type: 'date', nullable: true })
  updateStateAt?: string;

  @Column({ default: false })
  activeMessageTemplate: boolean;

  @ManyToMany(
    () => MessageTemplate,
    (messageTemplate) => messageTemplate.devices,
  )
  @JoinTable({ name: 'DeviceMessageTemplates' })
  messageTemplates?: MessageTemplate[];

  @OneToMany(
    () => HejHomeRecipeCommand,
    (hejHomeRecipeCommand) => hejHomeRecipeCommand.device,
  )
  deviceCommands?: HejHomeRecipeCommand[];
}
