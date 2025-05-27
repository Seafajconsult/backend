import { NotificationService } from "./notification.service";
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getUserNotifications(userId: string, page?: number, limit?: number): Promise<any>;
    getUnreadCount(userId: string): Promise<any>;
    markAsRead(id: string): Promise<any>;
    markAllAsRead(userId: string): Promise<any>;
    deleteNotification(id: string): Promise<any>;
}
