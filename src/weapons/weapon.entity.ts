import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import { TrackingRecord } from '../tracking/tracking.entity';
import { Alert } from '../alerts/alert.entity';

export enum WeaponStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  LOST = 'lost',
  MAINTENANCE = 'maintenance',
}

export enum WeaponType {
  RIFLE = 'rifle',
  PISTOL = 'pistol',
  SHOTGUN = 'shotgun',
  OTHER = 'other',
}

@Entity('weapons')
export class Weapon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string; // Ej: FUSIL-0047

  @Column()
  name: string;

  @Column({ type: 'enum', enum: WeaponType, default: WeaponType.RIFLE })
  type: WeaponType;

  @Column({ type: 'enum', enum: WeaponStatus, default: WeaponStatus.INACTIVE })
  status: WeaponStatus;

  @Column({ nullable: true })
  serialNumber: string;

  @Column({ nullable: true })
  assignedTo: string; // Nombre del portador

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  lastLatitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  lastLongitude: number;

  @Column({ nullable: true })
  lastLocation: string; // Descripción legible: "Tolemaida, C/Meta"

  @Column({ type: 'int', default: 100 })
  batteryLevel: number;

  @Column({ nullable: true })
  lastSeenAt: Date;

  @Column({ nullable: true })
  deviceId: string; // ID del LILYGO/módulo GPS

  @OneToMany(() => TrackingRecord, (record) => record.weapon)
  trackingHistory: TrackingRecord[];

  @OneToMany(() => Alert, (alert) => alert.weapon)
  alerts: Alert[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
