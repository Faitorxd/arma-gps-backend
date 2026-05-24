import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { TrackingModule } from '../tracking/tracking.module';
import { WeaponsModule } from '../weapons/weapons.module';

@Module({
  imports: [TrackingModule, WeaponsModule],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
