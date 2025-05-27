import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './notification.schema';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { NotificationType } from './notification.schema';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SMSService } from '../sms/sms.service';

@Injectable()
@WebSocketGateway()
export class NotificationService {
  @WebSocketServer()
  private server: Server;
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly smsService: SMSService,
  ) {}

  async createNotification(data: {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    data?: Record<string, any>;
    link?: string;
    sendSMS?: boolean;
    sendEmail?: boolean;
  }): Promise<Notification> {
    const notification = await this.notificationModel.create(data);

    // Emit real-time notification to the specific user
    this.server?.to(data.userId).emit('notification', notification);

    // Send SMS if requested and user has phone number
    if (data.sendSMS) {
      try {
        const user = await this.userService.findById(data.userId);
        const phoneNumber = await this.getUserPhoneNumber(user);
        if (phoneNumber) {
          await this.smsService.sendSMS({
            to: phoneNumber,
            message: `${data.title}: ${data.message}`,
          });
        }
      } catch (error) {
        this.logger.error(`Failed to send SMS notification: ${error.message}`);
      }
    }

    // Send email if requested
    if (data.sendEmail) {
      try {
        const user = await this.userService.findById(data.userId);
        if (user?.email) {
          await this.emailService.sendNotificationEmail(
            data.userId,
            data.title,
            data.message
          );
        }
      } catch (error) {
        this.logger.error(`Failed to send email notification: ${error.message}`);
      }
    }

    return notification;
  }

  private async getUserPhoneNumber(user: any): Promise<string | null> {
    if (!user) return null;

    try {
      // Check if user has populated profile data
      if (user.studentProfile?.phone) return user.studentProfile.phone;
      if (user.studentProfile?.phoneNumber) return user.studentProfile.phoneNumber;
      if (user.employerProfile?.phoneNumber) return user.employerProfile.phoneNumber;

      // For now, return null if no phone number is found
      // In a real implementation, you might want to query the profile collections directly
      this.logger.warn(`No phone number found for user ${user.userId}`);
      return null;
    } catch (error) {
      this.logger.error(`Error getting phone number for user ${user.userId}:`, error);
      return null;
    }
  }

  async getUserNotifications(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      this.notificationModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
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

  async markAsRead(id: string): Promise<Notification> {
    return this.notificationModel
      .findByIdAndUpdate(id, { isRead: true }, { new: true })
      .exec();
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationModel
      .updateMany({ userId, isRead: false }, { isRead: true })
      .exec();
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationModel.countDocuments({ userId, isRead: false });
  }

  async deleteNotification(id: string): Promise<void> {
    await this.notificationModel.findByIdAndDelete(id).exec();
  }

  async notifyNewUserRegistration(userId: string, email: string, role: string) {
    return this.createNotification({
      userId,
      title: 'Welcome to SEA-FAJ',
      message: `Welcome ${email}! Your account has been registered as a ${role.toLowerCase()}.`,
      type: NotificationType.SYSTEM_UPDATE,
      data: { role },
      link: '/profile'
    });
  }

  async notifyNewReferral(referrerId: string, referredUser: { userId: string; email: string }) {
    return this.createNotification({
      userId: referrerId,
      title: 'New Referral',
      message: `${referredUser.email} has registered using your referral code!`,
      type: NotificationType.NEW_REFERRAL,
      data: {
        referredUserId: referredUser.userId,
        referredUserEmail: referredUser.email,
      }
    });
  }

  async notifyReferralBonus(userId: string, amount: number) {
    return this.createNotification({
      userId,
      title: 'Referral Bonus Earned',
      message: `You've earned a referral bonus of ${amount} for your successful referral!`,
      type: NotificationType.REFERRAL_BONUS,
      data: { bonusAmount: amount }
    });
  }
}
