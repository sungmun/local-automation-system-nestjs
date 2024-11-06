import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  deviceId: string;

  @Column('text')
  logMessage: string;

  @Column()
  type: string;

  @CreateDateColumn()
  createdAt: Date;
}
