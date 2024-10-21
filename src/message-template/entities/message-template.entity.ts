import { Device } from '../../device/entities/device.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';

@Entity('MessageTemplates')
export class MessageTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  type: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @ManyToMany(() => Device, (device) => device.messageTemplates)
  @JoinTable({ name: 'DeviceMessageTemplates' })
  devices: Device[];
}
