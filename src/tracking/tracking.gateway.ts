import {
  WebSocketGateway, WebSocketServer,
  SubscribeMessage, MessageBody, ConnectedSocket,
  OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/tracking',
})
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(TrackingGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  // Suscribirse a updates de un arma específica
  @SubscribeMessage('subscribe_weapon')
  handleSubscribe(
    @MessageBody() data: { weaponId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`weapon_${data.weaponId}`);
    this.logger.log(`Cliente ${client.id} suscrito a arma ${data.weaponId}`);
    return { event: 'subscribed', data: { weaponId: data.weaponId } };
  }

  @SubscribeMessage('unsubscribe_weapon')
  handleUnsubscribe(
    @MessageBody() data: { weaponId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`weapon_${data.weaponId}`);
    return { event: 'unsubscribed', data: { weaponId: data.weaponId } };
  }

  // Emitir actualización de ubicación a todos los suscritos
  emitLocationUpdate(weaponId: string, locationData: any) {
    this.server.to(`weapon_${weaponId}`).emit('location_update', locationData);
    // También emitir a todos para el mapa general
    this.server.emit('all_weapons_update', { weaponId, ...locationData });
  }

  // Emitir alerta a todos los clientes
  emitAlert(alertData: any) {
    this.server.emit('new_alert', alertData);
  }
}
