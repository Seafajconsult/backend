import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "../user/user.schema";
import { Conversation } from "./conversation.schema";
export declare enum MessageType {
    TEXT = "text",
    SYSTEM = "system",
    NOTIFICATION = "notification",
    FILE = "file"
}
export declare enum MessageStatus {
    SENT = "sent",
    DELIVERED = "delivered",
    READ = "read"
}
export declare class Message extends Document {
    sender: User;
    conversation: Conversation;
    content: string;
    type: MessageType;
    status: MessageStatus;
    readBy: User[];
    metadata: Record<string, any>;
}
export declare const MessageSchema: MongooseSchema<Message, import("mongoose").Model<Message, any, any, any, Document<unknown, any, Message, any> & Message & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Message, Document<unknown, {}, import("mongoose").FlatRecord<Message>, {}> & import("mongoose").FlatRecord<Message> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
