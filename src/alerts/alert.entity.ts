import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Weapon } from '../weapons/weapon.entity';

export enum AlertType {
  OUT_OF_ZONE = 'out_of_zone',
  LOW_BATTERY = 'low_battery',
  SIGNAL_LOST = 'signal_lost',
  RAPID_MOVEMENT = 'rapid_movement',
  UNAUTHORIZED_USE = 'unauthorized_use',
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Weapon, (weapon) => weapon.alerts)
  @JoinColumn({ name: 'weapon_id' })
  weapon: Weapon;

  @Column()
  weaponId: string;

  @Column({ type: 'enum', enum: AlertType })
  type: AlertType;

  @Column({ type: 'enum', enum: AlertSeverity, default: AlertSeverity.MEDIUM })
  severity: AlertSeverity;

  @Column()
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ default: false })
  isResolved: boolean;

  @Column({ nullable: true })
  resolvedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
