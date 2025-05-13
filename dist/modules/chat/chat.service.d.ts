import { Model } from "mongoose";
import { ChatRoom, ChatMessage } from "./chat.schema";
export declare class ChatService {
    private chatRoomModel;
    private chatMessageModel;
    private connectedUsers;
    constructor(chatRoomModel: Model<ChatRoom>, chatMessageModel: Model<ChatMessage>);
    userConnected(userId: string, socketId: string): Promise<void>;
    userDisconnected(userId: string): Promise<void>;
    createRoom(participants: string[], isGroup?: boolean, groupName?: string): Promise<import("mongoose").Document<unknown, {}, ChatRoom, {}> & ChatRoom & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getRoomMessages(roomId: string, page?: number, limit?: number): Promise<(import("mongoose").Document<unknown, {}, ChatMessage, {}> & ChatMessage & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    createMessage(messageData: {
        roomId: string;
        senderId: string;
        content: string;
    }): Promise<import("mongoose").Document<unknown, {}, ChatMessage, {}> & ChatMessage & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    markMessageAsRead(messageId: string, userId: string): Promise<import("mongoose").Document<unknown, {}, ChatMessage, {}> & ChatMessage & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getUserRooms(userId: string): Promise<(import("mongoose").Document<unknown, {}, ChatRoom, {}> & ChatRoom & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
