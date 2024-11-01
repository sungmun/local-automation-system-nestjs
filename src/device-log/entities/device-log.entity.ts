import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class DeviceLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  deviceId: string;

  @Column('text')
  logMessage: string;

  @Column()
  type: string;

  @CreateDateColumn()
  createdAt: Date;
}
