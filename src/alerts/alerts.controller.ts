import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('alerts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar alertas' })
  findAll(@Query('weaponId') weaponId?: string) {
    return this.alertsService.findAll(weaponId);
  }

  @Get('unread')
  @ApiOperation({ summary: 'Alertas no leídas' })
  findUnread() {
    return this.alertsService.findUnread();
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marcar alerta como leída' })
  markAsRead(@Param('id') id: string) {
    return this.alertsService.markAsRead(id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Marcar todas como leídas' })
  markAllAsRead() {
    return this.alertsService.markAllAsRead();
  }

  @Patch(':id/resolve')
  @ApiOperation({ summary: 'Resolver alerta' })
  resolve(@Param('id') id: string) {
    return this.alertsService.resolve(id);
  }
}
