import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'messages',
})
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Store connected clients with their user IDs
  private connectedClients: Map<string, string> = new Map();

  constructor(
    private messageService: MessageService,
    private jwtService: JwtService,
  ) {}

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

      // Join rooms for all user's conversations
      const conversations = await this.messageService.findUserConversations(userId);
      conversations.forEach(conversation => {
        client.join(`conversation_${conversation._id}`);
      });

      console.log(`Client connected: ${client.id}, User: ${userId}`);
    } catch (error) {
      console.error('Connection error:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinConversation')
  handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.join(`conversation_${data.conversationId}`);
    return { event: 'joinedConversation', data: { conversationId: data.conversationId } };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leaveConversation')
  handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.leave(`conversation_${data.conversationId}`);
    return { event: 'leftConversation', data: { conversationId: data.conversationId } };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createMessageDto: CreateMessageDto,
  ) {
    try {
      const userId = this.connectedClients.get(client.id);
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const message = await this.messageService.createMessage(userId, createMessageDto);

      // Populate sender information
      const populatedMessage = await message.populate('sender');

      // Broadcast to all clients in the conversation room
      this.server.to(`conversation_${createMessageDto.conversationId}`).emit('newMessage', populatedMessage);

      return { event: 'messageSent', data: populatedMessage };
    } catch (error) {
      return { event: 'error', data: { message: error.message } };
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string },
  ) {
    try {
      const userId = this.connectedClients.get(client.id);
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const message = await this.messageService.markMessageAsRead(data.messageId, userId);

      // Broadcast to all clients in the conversation room
      this.server.to(`conversation_${message.conversation}`).emit('messageRead', {
        messageId: message._id,
        userId,
        status: message.status,
      });

      return { event: 'messageMarkedAsRead', data: { messageId: message._id } };
    } catch (error) {
      return { event: 'error', data: { message: error.message } };
    }
  }
}
