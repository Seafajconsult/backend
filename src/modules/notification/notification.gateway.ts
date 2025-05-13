import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'notifications',
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Store connected clients with their user IDs
  private connectedClients: Map<string, string> = new Map();

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      // Extract token from handshake
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        client.disconnect();
        return;
      }
      
      // Verify token
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;
      
      // Store client connection
      this.connectedClients.set(client.id, userId);
      
      // Join user's room for notifications
      client.join(userId);
      
      console.log(`Client connected to notifications: ${client.id}, User: ${userId}`);
    } catch (error) {
      console.error('Notification connection error:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    console.log(`Client disconnected from notifications: ${client.id}`);
  }

  // Method to send notification to a specific user
  sendNotificationToUser(userId: string, notification: any) {
    this.server.to(userId).emit('notification', notification);
  }
}
