import { Model } from "mongoose";
import { Notification, NotificationType } from "./notification.schema";
import { Server } from "socket.io";
export declare class NotificationService {
    private notificationModel;
    server: Server;
    constructor(notificationModel: Model<Notification>);
    createNotification(notificationData: {
        userId: string;
        title: string;
        message: string;
        type: NotificationType;
        data?: Record<string, any>;
        link?: string;
    }): Promise<import("mongoose").Document<unknown, {}, Notification, {}> & Notification & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getUserNotifications(userId: string, page?: number, limit?: number): Promise<{
        notifications: (import("mongoose").Document<unknown, {}, Notification, {}> & Notification & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    markAsRead(notificationId: string): Promise<import("mongoose").Document<unknown, {}, Notification, {}> & Notification & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    markAllAsRead(userId: string): Promise<import("mongoose").UpdateWriteOpResult>;
    deleteNotification(notificationId: string): Promise<import("mongoose").Document<unknown, {}, Notification, {}> & Notification & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getUnreadCount(userId: string): Promise<number>;
    notifySuperAdmins(title: string, message: string, type: NotificationType, data?: Record<string, any>, link?: string): Promise<{
        title: string;
        message: string;
        type: NotificationType;
        data: Record<string, any>;
        link: string;
        createdAt: Date;
    }>;
    notifyNewUserRegistration(userId: string, email: string, role: string): Promise<{
        title: string;
        message: string;
        type: NotificationType;
        data: Record<string, any>;
        link: string;
        createdAt: Date;
    }>;
}
