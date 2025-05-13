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
exports.MessageController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const message_service_1 = require("./message.service");
const create_message_dto_1 = require("./dto/create-message.dto");
const create_conversation_dto_1 = require("./dto/create-conversation.dto");
const swagger_1 = require("@nestjs/swagger");
let MessageController = class MessageController {
    constructor(messageService) {
        this.messageService = messageService;
    }
    async getMyConversations(req) {
        return this.messageService.findUserConversations(req.user.userId);
    }
    async getConversation(id, req) {
        const conversation = await this.messageService.findConversation(id);
        if (!conversation.participants.some(p => p.toString() === req.user.userId)) {
            throw new common_1.ForbiddenException("Access denied");
        }
        return conversation;
    }
    async getConversationMessages(id, limit, skip, req) {
        const conversation = await this.messageService.findConversation(id);
        if (!conversation.participants.some(p => p.toString() === req.user.userId)) {
            throw new common_1.ForbiddenException("Access denied");
        }
        return this.messageService.findConversationMessages(id, limit, skip);
    }
    async createConversation(createConversationDto, req) {
        if (!createConversationDto.participants.includes(req.user.userId)) {
            createConversationDto.participants.push(req.user.userId);
        }
        return this.messageService.createConversation(createConversationDto);
    }
    async sendMessage(createMessageDto, req) {
        return this.messageService.createMessage(req.user.userId, createMessageDto);
    }
    async markAsRead(id, req) {
        return this.messageService.markMessageAsRead(id, req.user.userId);
    }
    async deactivateConversation(id, req) {
        const conversation = await this.messageService.findConversation(id);
        if (!conversation.participants.some(p => p.toString() === req.user.userId)) {
            throw new common_1.ForbiddenException("Access denied");
        }
        return this.messageService.deactivateConversation(id);
    }
};
exports.MessageController = MessageController;
__decorate([
    (0, common_1.Get)("conversations"),
    (0, swagger_1.ApiOperation)({ summary: "Get all conversations for the current user" }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getMyConversations", null);
__decorate([
    (0, common_1.Get)("conversations/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Get a specific conversation" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getConversation", null);
__decorate([
    (0, common_1.Get)("conversations/:id/messages"),
    (0, swagger_1.ApiOperation)({ summary: "Get messages for a conversation" }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'skip', required: false, type: Number }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(50), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('skip', new common_1.DefaultValuePipe(0), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getConversationMessages", null);
__decorate([
    (0, common_1.Post)("conversations"),
    (0, swagger_1.ApiOperation)({ summary: "Create a new conversation" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_conversation_dto_1.CreateConversationDto, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "createConversation", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Send a new message" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_message_dto_1.CreateMessageDto, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Post)("messages/:id/read"),
    (0, swagger_1.ApiOperation)({ summary: "Mark a message as read" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Post)("conversations/:id/deactivate"),
    (0, swagger_1.ApiOperation)({ summary: "Deactivate a conversation" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "deactivateConversation", null);
exports.MessageController = MessageController = __decorate([
    (0, swagger_1.ApiTags)("Messages"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("messages"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [message_service_1.MessageService])
], MessageController);
//# sourceMappingURL=message.controller.js.map