import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { TrackingGateway } from './tracking.gateway';
import { TrackingRecord } from './tracking.entity';
import { WeaponsModule } from '../weapons/weapons.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrackingRecord]),
    WeaponsModule,
  ],
  providers: [TrackingService, TrackingGateway],
  controllers: [TrackingController],
  exports: [TrackingService, TrackingGateway],
})
export class TrackingModule {}
