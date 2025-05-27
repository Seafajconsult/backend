"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notification_schema_1 = require("./notification.schema");
const email_service_1 = require("../email/email.service");
const config_1 = require("@nestjs/config");
const user_service_1 = require("../user/user.service");
const realtime_gateway_1 = require("./realtime.gateway");
const twilio = require("twilio");
let NotificationService = class NotificationService {
    constructor(notificationModel, emailService, configService, userService, realtimeGateway) {
        this.notificationModel = notificationModel;
        this.emailService = emailService;
        this.configService = configService;
        this.userService = userService;
        this.realtimeGateway = realtimeGateway;
        this.logger = new common_1.Logger(NotificationService.name);
        this.twilioClient = twilio(this.configService.get('TWILIO_ACCOUNT_SID'), this.configService.get('TWILIO_AUTH_TOKEN'));
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        email_service_1.EmailService,
        config_1.ConfigService,
        user_service_1.UserService,
        realtime_gateway_1.RealtimeGateway])
], NotificationService);
let NotificationService = class NotificationService {
    constructor(notificationModel) {
        this.notificationModel = notificationModel;
    }
    async createNotification(notificationData) {
        const notification = await this.notificationModel.create(notificationData);
        this.server.to(notification.userId).emit("newNotification", notification);
        return notification;
    }
    async getUserNotifications(userId, page = 1, limit = 20) {
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
    async markAsRead(notificationId) {
        return this.notificationModel.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
    }
    async markAllAsRead(userId) {
        return this.notificationModel.updateMany({ userId, isRead: false }, { isRead: true });
    }
    async deleteNotification(notificationId) {
        return this.notificationModel.findByIdAndDelete(notificationId);
    }
    async getUnreadCount(userId) {
        return this.notificationModel.countDocuments({
            userId,
            isRead: false,
        });
    }
    async notifySuperAdmins(title, message, type, data, link) {
        console.log(`Super admin notification: ${title} - ${message}`);
        return {
            title,
            message,
            type,
            data,
            link,
            createdAt: new Date()
        };
    }
    async notifyNewUserRegistration(userId, email, role) {
        return this.notifySuperAdmins('New User Registration', `A new user (${email}) has registered as a ${role.toLowerCase()}.`, notification_schema_1.NotificationType.SYSTEM, { userId, email, role }, `/admin/users/${userId}`);
    }
    async notifyNewReferral(referrerId, referredUser) {
        return this.createNotification({
            userId: referrerId,
            title: 'New Referral Registration',
            message: `${referredUser.email} has registered using your referral code!`,
            type: notification_schema_1.NotificationType.NEW_REFERRAL,
            data: {
                referredUserId: referredUser.userId,
                referredUserEmail: referredUser.email,
            },
            link: '/dashboard/referrals'
        });
    }
    async notifyReferralBonus(userId, amount) {
        return this.createNotification({
            userId,
            title: 'Referral Bonus Earned',
            message: `You've earned a referral bonus of ${amount} for your successful referral!`,
            type: notification_schema_1.NotificationType.REFERRAL_BONUS,
            data: {
                bonusAmount: amount,
            }
        });
    }
};
exports.NotificationService = NotificationService;
__decorate([
    WebSocketServer(),
    __metadata("design:type", typeof (_a = typeof Server !== "undefined" && Server) === "function" ? _a : Object)
], NotificationService.prototype, "server", void 0);
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], NotificationService);
//# sourceMappingURL=notification.service.js.map