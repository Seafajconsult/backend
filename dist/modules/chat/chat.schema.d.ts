import { Document } from "mongoose";
import * as mongoose from "mongoose";
export declare class ChatRoom extends Document {
    participants: string[];
    isGroupChat: boolean;
    groupName?: string;
    isActive: boolean;
}
export declare class ChatMessage extends Document {
    roomId: string;
    senderId: string;
    content: string;
    isRead: boolean;
    readBy: string[];
}
export declare const ChatRoomSchema: mongoose.Schema<ChatRoom, mongoose.Model<ChatRoom, any, any, any, Document<unknown, any, ChatRoom, any> & ChatRoom & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, ChatRoom, Document<unknown, {}, mongoose.FlatRecord<ChatRoom>, {}> & mongoose.FlatRecord<ChatRoom> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export declare const ChatMessageSchema: mongoose.Schema<ChatMessage, mongoose.Model<ChatMessage, any, any, any, Document<unknown, any, ChatMessage, any> & ChatMessage & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, ChatMessage, Document<unknown, {}, mongoose.FlatRecord<ChatMessage>, {}> & mongoose.FlatRecord<ChatMessage> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
