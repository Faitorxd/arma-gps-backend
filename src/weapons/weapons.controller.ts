import {
  Controller, Get, Post, Body, Param,
  Delete, Patch, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { WeaponsService } from './weapons.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('weapons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('weapons')
export class WeaponsController {
  constructor(private readonly weaponsService: WeaponsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las armas' })
  findAll() {
    return this.weaponsService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Estadísticas generales' })
  getStats() {
    return this.weaponsService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un arma por ID' })
  findOne(@Param('id') id: string) {
    return this.weaponsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar nueva arma' })
  create(@Body() body: any) {
    return this.weaponsService.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar arma' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.weaponsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar arma' })
  remove(@Param('id') id: string) {
    return this.weaponsService.remove(id);
  }
}
