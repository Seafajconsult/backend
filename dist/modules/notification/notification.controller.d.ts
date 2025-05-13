import { NotificationService } from "./notification.service";
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getUserNotifications(userId: string, page?: number, limit?: number): Promise<{
        notifications: (import("mongoose").Document<unknown, {}, import("./notification.schema").Notification, {}> & import("./notification.schema").Notification & Required<{
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
    getUnreadCount(userId: string): Promise<number>;
    markAsRead(id: string): Promise<import("mongoose").Document<unknown, {}, import("./notification.schema").Notification, {}> & import("./notification.schema").Notification & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    markAllAsRead(userId: string): Promise<import("mongoose").UpdateWriteOpResult>;
    deleteNotification(id: string): Promise<import("mongoose").Document<unknown, {}, import("./notification.schema").Notification, {}> & import("./notification.schema").Notification & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
