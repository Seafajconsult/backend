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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notification_schema_1 = require("./notification.schema");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
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
};
exports.NotificationService = NotificationService;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationService.prototype, "server", void 0);
exports.NotificationService = NotificationService = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true,
        },
    }),
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], NotificationService);
//# sourceMappingURL=notification.service.js.map