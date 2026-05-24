import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert, AlertType, AlertSeverity } from './alert.entity';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepo: Repository<Alert>,
  ) {}

  async findAll(weaponId?: string): Promise<Alert[]> {
    const where = weaponId ? { weaponId } : {};
    return this.alertRepo.find({ where, order: { createdAt: 'DESC' }, take: 50 });
  }

  async findUnread(): Promise<Alert[]> {
    return this.alertRepo.find({ where: { isRead: false }, order: { createdAt: 'DESC' } });
  }

  async create(data: {
    weaponId: string;
    type: AlertType;
    severity: AlertSeverity;
    message: string;
  }): Promise<Alert> {
    const alert = this.alertRepo.create(data);
    return this.alertRepo.save(alert) as Promise<Alert>;
  }

  async markAsRead(id: string): Promise<Alert> {
    const alert = await this.alertRepo.findOneOrFail({ where: { id } });
    alert.isRead = true;
    return this.alertRepo.save(alert) as Promise<Alert>;
  }

  async markAllAsRead(): Promise<void> {
    await this.alertRepo.update({ isRead: false }, { isRead: true });
  }

  async resolve(id: string): Promise<Alert> {
    const alert = await this.alertRepo.findOneOrFail({ where: { id } });
    alert.isResolved = true;
    alert.resolvedAt = new Date();
    return this.alertRepo.save(alert) as Promise<Alert>;
  }

  async checkLowBattery(weaponId: string, battery: number): Promise<void> {
    if (battery <= 20) {
      await this.create({
        weaponId,
        type: AlertType.LOW_BATTERY,
        severity: battery <= 10 ? AlertSeverity.CRITICAL : AlertSeverity.HIGH,
        message: `Batería baja: ${battery}%`,
      });
    }
  }
}
