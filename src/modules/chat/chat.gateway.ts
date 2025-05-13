import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UseGuards } from "@nestjs/common";
import { WsJwtGuard } from "./guards/ws-jwt.guard";
import { ChatService } from "./chat.service";

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})
@UseGuards(WsJwtGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    const user = client.handshake.auth.user;
    await this.chatService.userConnected(user.userId, client.id);
  }

  async handleDisconnect(client: Socket) {
    const user = client.handshake.auth.user;
    await this.chatService.userDisconnected(user.userId);
  }

  @SubscribeMessage("joinRoom")
  async handleJoinRoom(client: Socket, roomId: string) {
    await client.join(roomId);
    return { event: "joinedRoom", data: roomId };
  }

  @SubscribeMessage("leaveRoom")
  async handleLeaveRoom(client: Socket, roomId: string) {
    await client.leave(roomId);
    return { event: "leftRoom", data: roomId };
  }

  @SubscribeMessage("sendMessage")
  async handleMessage(
    client: Socket,
    payload: { roomId: string; content: string },
  ) {
    const user = client.handshake.auth.user;
    const message = await this.chatService.createMessage({
      roomId: payload.roomId,
      senderId: user.userId,
      content: payload.content,
    });

    this.server.to(payload.roomId).emit("newMessage", message);
    return message;
  }

  @SubscribeMessage("markAsRead")
  async handleMarkAsRead(client: Socket, messageId: string) {
    const user = client.handshake.auth.user;
    await this.chatService.markMessageAsRead(messageId, user.userId);
    return { event: "messageRead", data: messageId };
  }
}
