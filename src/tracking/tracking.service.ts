import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrackingRecord } from './tracking.entity';
import { TrackingGateway } from './tracking.gateway';
import { WeaponsService } from '../weapons/weapons.service';

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(TrackingRecord)
    private readonly trackingRepo: Repository<TrackingRecord>,
    private readonly gateway: TrackingGateway,
    private readonly weaponsService: WeaponsService,
  ) {}

  async recordLocation(data: {
    weaponId: string;
    latitude: number;
    longitude: number;
    battery: number;
    accuracy?: number;
    speed?: number;
    location?: string;
    rawData?: string;
  }): Promise<TrackingRecord> {
    // Guardar en historial
    const record = this.trackingRepo.create(data);
    const saved = await this.trackingRepo.save(record);

    // Actualizar última ubicación en el arma
    await this.weaponsService.updateLocation(
      data.weaponId,
      data.latitude,
      data.longitude,
      data.battery,
      data.location,
    );

    // Emitir por WebSocket en tiempo real
    this.gateway.emitLocationUpdate(data.weaponId, {
      weaponId: data.weaponId,
      latitude: data.latitude,
      longitude: data.longitude,
      battery: data.battery,
      location: data.location,
      accuracy: data.accuracy,
      speed: data.speed,
      timestamp: saved.createdAt,
    });

    return saved;
  }

  async getHistory(weaponId: string, limit = 100): Promise<TrackingRecord[]> {
    return this.trackingRepo.find({
      where: { weaponId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getLastPosition(weaponId: string): Promise<TrackingRecord | null> {
    return this.trackingRepo.findOne({
      where: { weaponId },
      order: { createdAt: 'DESC' },
    });
  }
}
