import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private messageService;
    private jwtService;
    server: Server;
    private connectedClients;
    constructor(messageService: MessageService, jwtService: JwtService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleJoinConversation(client: Socket, data: {
        conversationId: string;
    }): {
        event: string;
        data: {
            conversationId: string;
        };
    };
    handleLeaveConversation(client: Socket, data: {
        conversationId: string;
    }): {
        event: string;
        data: {
            conversationId: string;
        };
    };
    handleSendMessage(client: Socket, createMessageDto: CreateMessageDto): Promise<{
        event: string;
        data: Omit<import("./message.schema").Message, never>;
    } | {
        event: string;
        data: {
            message: any;
        };
    }>;
    handleMarkAsRead(client: Socket, data: {
        messageId: string;
    }): Promise<{
        event: string;
        data: {
            messageId: unknown;
            message?: undefined;
        };
    } | {
        event: string;
        data: {
            message: any;
            messageId?: undefined;
        };
    }>;
}
