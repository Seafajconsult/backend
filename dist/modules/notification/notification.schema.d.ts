import { Document } from "mongoose";
import * as mongoose from "mongoose";
export declare enum NotificationType {
    DOCUMENT_STATUS = "document_status",
    PAYMENT_STATUS = "payment_status",
    APPLICATION_UPDATE = "application_update",
    CHAT_MESSAGE = "chat_message",
    SYSTEM = "system"
}
export declare class Notification extends Document {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    data?: Record<string, any>;
    link?: string;
}
export declare const NotificationSchema: mongoose.Schema<Notification, mongoose.Model<Notification, any, any, any, Document<unknown, any, Notification, any> & Notification & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Notification, Document<unknown, {}, mongoose.FlatRecord<Notification>, {}> & mongoose.FlatRecord<Notification> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
