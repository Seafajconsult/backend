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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const notification_service_1 = require("./notification.service");
const user_service_1 = require("../user/user.service");
const ws_jwt_guard_1 = require("../auth/guards/ws-jwt.guard");
let RealtimeGateway = class RealtimeGateway {
    constructor(notificationService, userService) {
        this.notificationService = notificationService;
        this.userService = userService;
        this.userSockets = new Map();
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token;
            if (!token) {
                throw new websockets_1.WsException('Unauthorized');
            }
            const user = await this.userService.validateToken(token);
            if (!user) {
                throw new websockets_1.WsException('Invalid token');
            }
            if (!this.userSockets.has(user.userId)) {
                this.userSockets.set(user.userId, new Set());
            }
            this.userSockets.get(user.userId).add(client.id);
            client.join(`user:${user.userId}`);
            client.join(`role:${user.role}`);
            const notifications = await this.notificationService.getUnreadNotifications(user.userId);
            client.emit('notifications', notifications);
        }
        catch (error) {
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        for (const [userId, sockets] of this.userSockets.entries()) {
            if (sockets.has(client.id)) {
                sockets.delete(client.id);
                if (sockets.size === 0) {
                    this.userSockets.delete(userId);
                }
                break;
            }
        }
    }
    async handleMarkAsRead(client, notificationId) {
        const user = client.data.user;
        await this.notificationService.markAsRead(notificationId, user.userId);
    }
    async broadcastToUser(userId, event, data) {
        this.server.to(`user:${userId}`).emit(event, data);
    }
    async broadcastToRole(role, event, data) {
        this.server.to(`role:${role}`).emit(event, data);
    }
    async broadcastApplicationUpdate(applicationId, update) {
        this.server.to(`application:${applicationId}`).emit('applicationUpdate', update);
    }
};
exports.RealtimeGateway = RealtimeGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RealtimeGateway.prototype, "server", void 0);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    (0, websockets_1.SubscribeMessage)('markAsRead'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], RealtimeGateway.prototype, "handleMarkAsRead", null);
exports.RealtimeGateway = RealtimeGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
        },
        namespace: '/notifications',
    }),
    __metadata("design:paramtypes", [notification_service_1.NotificationService,
        user_service_1.UserService])
], RealtimeGateway);
//# sourceMappingURL=realtime.gateway.js.map