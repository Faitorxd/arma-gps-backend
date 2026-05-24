import { Module } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { SimulationController } from './simulation.controller';
import { WeaponsModule } from '../weapons/weapons.module';
import { TrackingModule } from '../tracking/tracking.module';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
  imports: [WeaponsModule, TrackingModule, AlertsModule],
  providers: [SimulationService],
  controllers: [SimulationController],
  exports: [SimulationService],
})
export class SimulationModule {}
