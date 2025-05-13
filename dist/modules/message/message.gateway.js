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
exports.MessageGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const message_service_1 = require("./message.service");
const create_message_dto_1 = require("./dto/create-message.dto");
const ws_jwt_guard_1 = require("../auth/guards/ws-jwt.guard");
let MessageGateway = class MessageGateway {
    constructor(messageService, jwtService) {
        this.messageService = messageService;
        this.jwtService = jwtService;
        this.connectedClients = new Map();
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
            if (!token) {
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token);
            const userId = payload.sub;
            this.connectedClients.set(client.id, userId);
            const conversations = await this.messageService.findUserConversations(userId);
            conversations.forEach(conversation => {
                client.join(`conversation_${conversation._id}`);
            });
            console.log(`Client connected: ${client.id}, User: ${userId}`);
        }
        catch (error) {
            console.error('Connection error:', error.message);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        this.connectedClients.delete(client.id);
        console.log(`Client disconnected: ${client.id}`);
    }
    handleJoinConversation(client, data) {
        client.join(`conversation_${data.conversationId}`);
        return { event: 'joinedConversation', data: { conversationId: data.conversationId } };
    }
    handleLeaveConversation(client, data) {
        client.leave(`conversation_${data.conversationId}`);
        return { event: 'leftConversation', data: { conversationId: data.conversationId } };
    }
    async handleSendMessage(client, createMessageDto) {
        try {
            const userId = this.connectedClients.get(client.id);
            if (!userId) {
                throw new Error('User not authenticated');
            }
            const message = await this.messageService.createMessage(userId, createMessageDto);
            const populatedMessage = await message.populate('sender');
            this.server.to(`conversation_${createMessageDto.conversationId}`).emit('newMessage', populatedMessage);
            return { event: 'messageSent', data: populatedMessage };
        }
        catch (error) {
            return { event: 'error', data: { message: error.message } };
        }
    }
    async handleMarkAsRead(client, data) {
        try {
            const userId = this.connectedClients.get(client.id);
            if (!userId) {
                throw new Error('User not authenticated');
            }
            const message = await this.messageService.markMessageAsRead(data.messageId, userId);
            this.server.to(`conversation_${message.conversation}`).emit('messageRead', {
                messageId: message._id,
                userId,
                status: message.status,
            });
            return { event: 'messageMarkedAsRead', data: { messageId: message._id } };
        }
        catch (error) {
            return { event: 'error', data: { message: error.message } };
        }
    }
};
exports.MessageGateway = MessageGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessageGateway.prototype, "server", void 0);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    (0, websockets_1.SubscribeMessage)('joinConversation'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], MessageGateway.prototype, "handleJoinConversation", null);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    (0, websockets_1.SubscribeMessage)('leaveConversation'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], MessageGateway.prototype, "handleLeaveConversation", null);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        create_message_dto_1.CreateMessageDto]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    (0, websockets_1.SubscribeMessage)('markAsRead'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleMarkAsRead", null);
exports.MessageGateway = MessageGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
        namespace: 'messages',
    }),
    __metadata("design:paramtypes", [message_service_1.MessageService,
        jwt_1.JwtService])
], MessageGateway);
//# sourceMappingURL=message.gateway.js.map