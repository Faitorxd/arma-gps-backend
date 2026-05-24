import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Weapon, WeaponStatus } from './weapon.entity';

@Injectable()
export class WeaponsService {
  constructor(
    @InjectRepository(Weapon)
    private readonly weaponRepo: Repository<Weapon>,
  ) {}

  async findAll(): Promise<Weapon[]> {
    return this.weaponRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Weapon> {
    const weapon = await this.weaponRepo.findOne({ where: { id } });
    if (!weapon) throw new NotFoundException(`Arma ${id} no encontrada`);
    return weapon;
  }

  async findByCode(code: string): Promise<Weapon | null> {
    return this.weaponRepo.findOne({ where: { code } });
  }

  async create(data: Partial<Weapon>): Promise<Weapon> {
    const weapon = this.weaponRepo.create(data);
    return this.weaponRepo.save(weapon);
  }

  async update(id: string, data: Partial<Weapon>): Promise<Weapon> {
    const weapon = await this.findOne(id);
    Object.assign(weapon, data);
    return this.weaponRepo.save(weapon);
  }

  async updateLocation(
    weaponId: string,
    latitude: number,
    longitude: number,
    battery: number,
    location?: string,
  ): Promise<Weapon> {
    const weapon = await this.findOne(weaponId);
    weapon.lastLatitude = latitude;
    weapon.lastLongitude = longitude;
    weapon.batteryLevel = battery;
    weapon.lastLocation = location || weapon.lastLocation;
    weapon.lastSeenAt = new Date();
    weapon.status = WeaponStatus.ACTIVE;
    return this.weaponRepo.save(weapon);
  }

  async remove(id: string): Promise<void> {
    const weapon = await this.findOne(id);
    await this.weaponRepo.remove(weapon);
  }

  async getStats() {
    const total = await this.weaponRepo.count();
    const active = await this.weaponRepo.count({ where: { status: WeaponStatus.ACTIVE } });
    const lost = await this.weaponRepo.count({ where: { status: WeaponStatus.LOST } });
    const inactive = await this.weaponRepo.count({ where: { status: WeaponStatus.INACTIVE } });
    return { total, active, lost, inactive };
  }
}
