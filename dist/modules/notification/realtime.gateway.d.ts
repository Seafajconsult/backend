import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';
import { UserService } from '../user/user.service';
export declare class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly notificationService;
    private readonly userService;
    server: Server;
    private userSockets;
    constructor(notificationService: NotificationService, userService: UserService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleMarkAsRead(client: Socket, notificationId: string): Promise<void>;
    broadcastToUser(userId: string, event: string, data: any): Promise<void>;
    broadcastToRole(role: string, event: string, data: any): Promise<void>;
    broadcastApplicationUpdate(applicationId: string, update: any): Promise<void>;
}
