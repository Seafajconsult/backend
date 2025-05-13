import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Notification, NotificationType } from "./notification.schema";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})
@Injectable()
export class NotificationService {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {}

  async createNotification(notificationData: {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    data?: Record<string, any>;
    link?: string;
  }) {
    const notification = await this.notificationModel.create(notificationData);

    // Emit real-time notification
    this.server.to(notification.userId).emit("newNotification", notification);

    return notification;
  }

  async getUserNotifications(userId: string, page = 1, limit = 20) {
    const [notifications, total] = await Promise.all([
      this.notificationModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.notificationModel.countDocuments({ userId }),
    ]);

    return {
      notifications,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async markAsRead(notificationId: string) {
    return this.notificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true },
    );
  }

  async markAllAsRead(userId: string) {
    return this.notificationModel.updateMany(
      { userId, isRead: false },
      { isRead: true },
    );
  }

  async deleteNotification(notificationId: string) {
    return this.notificationModel.findByIdAndDelete(notificationId);
  }

  async getUnreadCount(userId: string) {
    return this.notificationModel.countDocuments({
      userId,
      isRead: false,
    });
  }

  async notifySuperAdmins(
    title: string,
    message: string,
    type: NotificationType,
    data?: Record<string, any>,
    link?: string
  ) {
    // This method would be called when important events happen that super admins should know about
    // For example, when a new user registers

    // In a real implementation, you would:
    // 1. Find all super admin users
    // 2. Create a notification for each super admin
    // 3. Emit real-time notifications to all super admins

    // For now, we'll just create a placeholder that can be implemented when the UserService is available
    console.log(`Super admin notification: ${title} - ${message}`);

    // Return a placeholder notification
    return {
      title,
      message,
      type,
      data,
      link,
      createdAt: new Date()
    };
  }

  async notifyNewUserRegistration(userId: string, email: string, role: string) {
    return this.notifySuperAdmins(
      'New User Registration',
      `A new user (${email}) has registered as a ${role.toLowerCase()}.`,
      NotificationType.SYSTEM,
      { userId, email, role },
      `/admin/users/${userId}`
    );
  }
}
