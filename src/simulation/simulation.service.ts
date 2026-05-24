import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { WeaponsService } from '../weapons/weapons.service';
import { TrackingService } from '../tracking/tracking.service';
import { AlertsService } from '../alerts/alerts.service';

interface SimulationState {
  weaponId: string;
  latitude: number;
  longitude: number;
  battery: number;
}

@Injectable()
export class SimulationService implements OnModuleDestroy {
  private readonly logger = new Logger(SimulationService.name);
  private simulationInterval: ReturnType<typeof setInterval> | null = null;
  private activeSimulations = new Map<string, SimulationState>();

  // Base coordinates (e.g. Tolemaida)
  private readonly BASE_LAT = 4.225;
  private readonly BASE_LNG = -74.723;
  private readonly INTERVAL_MS = 5000;

  constructor(
    private readonly weaponsService: WeaponsService,
    private readonly trackingService: TrackingService,
    private readonly alertsService: AlertsService,
  ) {}

  onModuleDestroy() {
    this.stopSimulation();
  }

  async startSimulation() {
    if (this.simulationInterval) {
      return;
    }

    const weapons = await this.weaponsService.findAll();
    for (const weapon of weapons) {
      this.initWeaponState(weapon);
    }

    this.logger.log(`Starting simulation for ${this.activeSimulations.size} weapons`);
    this.simulationInterval = setInterval(() => this.tick(), this.INTERVAL_MS);
  }

  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    this.activeSimulations.clear();
    this.logger.log('Simulation stopped');
  }

  async startWeaponSimulation(weaponId: string) {
    const weapon = await this.weaponsService.findOne(weaponId);
    if (!weapon) {
      throw new Error(`Weapon with ID ${weaponId} not found`);
    }

    this.initWeaponState(weapon);
    if (!this.simulationInterval) {
      this.simulationInterval = setInterval(() => this.tick(), this.INTERVAL_MS);
    }
    this.logger.log(`Simulation started for weapon ${weaponId}`);
  }

  getStatus() {
    return {
      active: this.simulationInterval !== null,
      simulatedWeapons: Array.from(this.activeSimulations.keys()),
    };
  }

  private initWeaponState(weapon: any) {
    this.activeSimulations.set(weapon.id, {
      weaponId: weapon.id,
      latitude: weapon.lastLatitude ? Number(weapon.lastLatitude) : this.BASE_LAT,
      longitude: weapon.lastLongitude ? Number(weapon.lastLongitude) : this.BASE_LNG,
      battery: weapon.batteryLevel !== undefined ? Number(weapon.batteryLevel) : 100,
    });
  }

  private async tick() {
    for (const state of this.activeSimulations.values()) {
      // Move slightly
      state.latitude += (Math.random() - 0.5) * 0.0001;
      state.longitude += (Math.random() - 0.5) * 0.0001;
      
      // Decrease battery randomly
      if (Math.random() > 0.7 && state.battery > 0) {
        state.battery -= 1;
      }

      try {
        await this.trackingService.recordLocation({
          weaponId: state.weaponId,
          latitude: state.latitude,
          longitude: state.longitude,
          battery: state.battery,
          location: 'Tolemaida (Simulado)',
          accuracy: Math.random() * 5 + 1,
          speed: Math.random() * 2,
        });

        // Trigger battery alert check
        await this.alertsService.checkLowBattery(state.weaponId, state.battery);

      } catch (error: any) {
        this.logger.error(`Error simulating weapon ${state.weaponId}: ${error.message}`);
      }
    }
  }
}
