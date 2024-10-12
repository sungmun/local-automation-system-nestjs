import { Room } from '../../room/entities/room.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

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
}
