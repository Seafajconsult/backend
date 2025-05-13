import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    server: Server;
    constructor(chatService: ChatService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleJoinRoom(client: Socket, roomId: string): Promise<{
        event: string;
        data: string;
    }>;
    handleLeaveRoom(client: Socket, roomId: string): Promise<{
        event: string;
        data: string;
    }>;
    handleMessage(client: Socket, payload: {
        roomId: string;
        content: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./chat.schema").ChatMessage, {}> & import("./chat.schema").ChatMessage & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    handleMarkAsRead(client: Socket, messageId: string): Promise<{
        event: string;
        data: string;
    }>;
}
