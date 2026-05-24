import { Controller, Post, Get, Param, HttpCode } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Simulation')
@Controller('api/v1/simulation')
export class SimulationController {
  constructor(private readonly simulationService: SimulationService) {}

  @Post('start')
  @HttpCode(200)
  @ApiOperation({ summary: 'Iniciar simulación para todas las armas' })
  async start() {
    await this.simulationService.startSimulation();
    return { message: 'Simulación iniciada para todas las armas' };
  }

  @Post('stop')
  @HttpCode(200)
  @ApiOperation({ summary: 'Detener simulación' })
  stop() {
    this.simulationService.stopSimulation();
    return { message: 'Simulación detenida' };
  }

  @Post('start/:weaponId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Iniciar simulación para un arma específica' })
  async startWeapon(@Param('weaponId') weaponId: string) {
    await this.simulationService.startWeaponSimulation(weaponId);
    return { message: `Simulación iniciada para el arma ${weaponId}` };
  }

  @Get('status')
  @ApiOperation({ summary: 'Ver estado de la simulación' })
  getStatus() {
    return this.simulationService.getStatus();
  }
}
