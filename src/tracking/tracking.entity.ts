import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Weapon } from '../weapons/weapon.entity';

@Entity('tracking_records')
export class TrackingRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Weapon, (weapon) => weapon.trackingHistory)
  @JoinColumn({ name: 'weapon_id' })
  weapon: Weapon;

  @Column()
  weaponId: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  accuracy: number; // metros

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  speed: number; // km/h

  @Column({ type: 'int', nullable: true })
  battery: number;

  @Column({ nullable: true })
  rawData: string; // JSON crudo del LILYGO

  @CreateDateColumn()
  createdAt: Date;
}
