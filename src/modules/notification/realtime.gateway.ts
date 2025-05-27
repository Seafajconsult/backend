import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationService } from './notification.service';
import { UserService } from '../user/user.service';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/notifications',
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, Set<string>> = new Map();

  constructor(
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        throw new WsException('Unauthorized');
      }

      const user = await this.userService.validateToken(token);
      if (!user) {
        throw new WsException('Invalid token');
      }

      // Store socket connection
      if (!this.userSockets.has(user.userId)) {
        this.userSockets.set(user.userId, new Set());
      }
      this.userSockets.get(user.userId).add(client.id);

      // Join user-specific room
      client.join(`user:${user.userId}`);

      // Join role-specific room
      client.join(`role:${user.role}`);

      // Send initial notifications
      const notifications = await this.notificationService.getUserNotifications(user.userId);
      client.emit('notifications', notifications);

    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    // Clean up socket mappings
    for (const [userId, sockets] of this.userSockets.entries()) {
      if (sockets.has(client.id)) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
        }
        break;
      }
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(client: Socket, notificationId: string): Promise<void> {
    const user = client.data.user;
    await this.notificationService.markAsRead(notificationId);
  }

  // Method to broadcast notifications
  async broadcastToUser(userId: string, event: string, data: any): Promise<void> {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  // Method to broadcast to a specific role
  async broadcastToRole(role: string, event: string, data: any): Promise<void> {
    this.server.to(`role:${role}`).emit(event, data);
  }

  // Method to broadcast application updates
  async broadcastApplicationUpdate(applicationId: string, update: any): Promise<void> {
    this.server.to(`application:${applicationId}`).emit('applicationUpdate', update);
  }
}
