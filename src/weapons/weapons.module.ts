import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeaponsService } from './weapons.service';
import { WeaponsController } from './weapons.controller';
import { Weapon } from './weapon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Weapon])],
  providers: [WeaponsService],
  controllers: [WeaponsController],
  exports: [WeaponsService],
})
export class WeaponsModule {}
