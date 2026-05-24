import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mqtt from 'mqtt';
import { TrackingService } from '../tracking/tracking.service';
import { WeaponsService } from '../weapons/weapons.service';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private client: mqtt.MqttClient;
  private readonly logger = new Logger(MqttService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly trackingService: TrackingService,
    private readonly weaponsService: WeaponsService,
  ) {}

  onModuleInit() {
    this.connect();
  }

  onModuleDestroy() {
    if (this.client) this.client.end();
  }

  private connect() {
    const host = this.config.get('MQTT_HOST');
    const port = this.config.get('MQTT_PORT');
    const username = this.config.get('MQTT_USERNAME');
    const password = this.config.get('MQTT_PASSWORD');

    const options: mqtt.IClientOptions = {
      host,
      port: +port,
      protocol: 'mqtt',
      ...(username && { username }),
      ...(password && { password }),
      reconnectPeriod: 5000,
    };

    this.client = mqtt.connect(options);

    this.client.on('connect', () => {
      this.logger.log(`✅ Conectado al broker MQTT: ${host}:${port}`);
      this.subscribeToTopics();
    });

    this.client.on('error', (err) => {
      this.logger.warn(`⚠️ MQTT no disponible (${err.message}) - continuando sin MQTT`);
    });

    this.client.on('message', (topic, payload) => {
      this.handleMessage(topic, payload.toString());
    });
  }

  private subscribeToTopics() {
    // Topic formato: armas/{weaponCode}/gps
    this.client.subscribe('armas/+/gps', { qos: 1 });
    this.client.subscribe('armas/+/status', { qos: 1 });
    this.client.subscribe('armas/+/battery', { qos: 1 });
    this.logger.log('📡 Suscrito a topics MQTT');
  }

  private async handleMessage(topic: string, payload: string) {
    this.logger.debug(`MQTT [${topic}]: ${payload}`);

    try {
      const parts = topic.split('/');
      const weaponCode = parts[1];
      const messageType = parts[2];

      const data = JSON.parse(payload);

      // Buscar el arma por código
      const weapon = await this.weaponsService.findByCode(weaponCode);
      if (!weapon) {
        this.logger.warn(`Arma no encontrada: ${weaponCode}`);
        return;
      }

      if (messageType === 'gps') {
        // Formato esperado del LILYGO:
        // { "lat": 4.1234, "lng": -73.5678, "bat": 85, "acc": 5.2, "spd": 0 }
        await this.trackingService.recordLocation({
          weaponId: weapon.id,
          latitude: data.lat,
          longitude: data.lng,
          battery: data.bat || 100,
          accuracy: data.acc,
          speed: data.spd,
          rawData: payload,
        });
      }

      if (messageType === 'battery') {
        await this.weaponsService.update(weapon.id, { batteryLevel: data.level });
      }

    } catch (err) {
      this.logger.error(`Error procesando mensaje MQTT: ${err.message}`);
    }
  }

  // Publicar comando al dispositivo
  publish(topic: string, message: object) {
    if (this.client?.connected) {
      this.client.publish(topic, JSON.stringify(message), { qos: 1 });
    }
  }
}
