import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TrackingService } from './tracking.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('tracking')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get(':weaponId/history')
  @ApiOperation({ summary: 'Historial de ubicaciones de un arma' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getHistory(
    @Param('weaponId') weaponId: string,
    @Query('limit') limit?: number,
  ) {
    return this.trackingService.getHistory(weaponId, limit || 100);
  }

  @Get(':weaponId/last')
  @ApiOperation({ summary: 'Última posición de un arma' })
  getLastPosition(@Param('weaponId') weaponId: string) {
    return this.trackingService.getLastPosition(weaponId);
  }
}
