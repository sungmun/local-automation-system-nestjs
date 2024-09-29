import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Devices')
export class Device {
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  deviceType: string;

  @Column({ type: 'text' })
  modelName: string;

  @Column({ type: 'text' })
  familyId: string;

  @Column({ type: 'text' })
  roomId: string;

  @Column({ type: 'text' })
  category: string;

  @Column()
  online: boolean;

  @Column()
  hasSubDevices: boolean;
}
